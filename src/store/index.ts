import Vue from 'vue';
import Vuex from 'vuex';
import iconDatas from '@/constant/iconDatas.ts';
import toFloat from '@/lib/toFloat.ts';
import { Message, MessageBox  } from 'element-ui';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
      iconDatas : [] as CreatedTags[],
      pendingDatas : [] as CreatedTags[],
      selfTagsList : [] as CreatedTags[],
      currentTag: {} as CreatedTags,
      mergeIcon: [] as CreatedTags[],
      existName: false,
      tallyRecord: [] as RecordItem[],
      searchWord: '',
  },
  getters: {
  },
  mutations: {
    fetchTags: (state) => {
        state.iconDatas = JSON.parse(localStorage.getItem('iconDatas') || JSON.stringify(iconDatas));
        state.selfTagsList = JSON.parse(localStorage.getItem('selfTagsList') || '[]');
        state.pendingDatas = JSON.parse(localStorage.getItem('pendingDatas') || '[]');
        const mergeIcon = state.selfTagsList.concat(state.iconDatas.sort((item1: CreatedTags, item2: CreatedTags) => {
          return item1.id - item2.id;
        }));
        state.mergeIcon = mergeIcon;
    },
    getCurrentTags(state, id) {
      if (!state.selfTagsList) {
        return;
      }
      const currentTag = JSON.parse(JSON.stringify(state.selfTagsList.filter((item: CreatedTags) => {
        return item.id === id;
      })[0]));
      if (currentTag) {
        state.currentTag = currentTag;
      } else {
        Message({
          message: '请确认ID是否存在',
          type: 'warning',
          duration: 1000,
        });
      }
    },
    createTags: (state, newTags: CreatedTags) => {
      const isNameExist = state.mergeIcon.filter((item: CreatedTags) => {
        return item.name === newTags.name;
      });
      if (isNameExist.length > 0) {
        return Message(
          {
            message: '标签已存在该名称',
            type: 'warning',
            duration: 1000,
            offset: 150,
          },
        );
      }
      state.selfTagsList.push(newTags);
      localStorage.setItem('selfTagsList', JSON.stringify(state.selfTagsList));
      Message({
        message: '标签添加成功',
        type: 'success',
        duration: 2000,
        offset: 150,
      });
    },
    updateTags: (state, payload: {id: number, newTags: CreatedTags}) => {
      const isNameExist = state.mergeIcon.filter((item: CreatedTags) => {
        return item.name === payload.newTags.name;
      })[0];
      if (isNameExist.id !== payload.id) {
        return Message(
          {
            message: '标签名不能相同',
            type: 'warning',
            duration: 1000,
            offset: 150,
          },
        );
      }
      const currentTag = state.selfTagsList.filter((item) => {
        return item.id === payload.id;
      })[0];
      const currentIndex = state.selfTagsList.indexOf(currentTag);
      state.selfTagsList[currentIndex] = JSON.parse(JSON.stringify(payload.newTags));
      // 深拷贝防止内存引用

      // selfTagsList.push(this.newTags)

      localStorage.setItem('selfTagsList', JSON.stringify(state.selfTagsList));
      Message({
        message: '标签修改成功',
        type: 'success',
        duration: 2000,
        offset: 150,
      });
    },
    existName: (state, newTagName) => {
        const isNameExist = state.mergeIcon.filter((item: CreatedTags) => {
          return item.name === newTagName;
        });
        if (isNameExist.length > 0) {
          state.existName = true;
          return Message(
            {
                  message: '标签已存在该名称',
                  type: 'warning',
                  duration: 1000,
                  offset: 150,
            },
          );
        }
    },
    iniExistName: (state) => {
      state.existName = false;
    },
    fetchRecord: (state) => {

      const formatTallyRecord = JSON.parse(localStorage.getItem('tallyRecord') || '[]');

      for (const record of formatTallyRecord) {
        const iconData = state.mergeIcon.filter((item: CreatedTags) => {
          return item.id === record.tagId;
        })[0];
        if (!iconData) {
          return Message(
            {
              message: '记录包含的标签不存在，请确认。',
              type: 'warning',
              duration: 1000,
              offset: 150,
            },
          );
        }
        record.name = iconData.name;
        record.iconName = iconData.src;

        record.amount = toFloat(record.amount);

      }

      state.tallyRecord = formatTallyRecord;

    },
    updateRecord: (state, payload= {} as RecordItem) => {
      const currentRecord = state.tallyRecord.filter((item: RecordItem) => {
        return item.id === payload.id;
      })[0];
      if (!currentRecord) {
        // 如果找不到当前记录，就返回出去
        return Message({
          message: '编辑失败,请确认id是否存在',
          type: 'warning',
          duration: 1000,
          offset: 150,
        });
      }
      const index =  state.tallyRecord.indexOf(currentRecord);
      state.tallyRecord[index] = payload;

      localStorage.setItem('tallyRecord', JSON.stringify(state.tallyRecord));

      Message({
        message: '编辑成功',
        type: 'success',
        duration: 1000,
        offset: 150,
      });
    },
    deleteRecord: (state, id: number) => {
      if (id) {
        const currentRecord = state.tallyRecord.filter((item: RecordItem) => {
          return item.id === id;
        })[0];
        if (!currentRecord) {
          // 如果找不到当前记录，就返回出去
          return Message({
            message: '删除失败,请确认id是否存在',
            type: 'warning',
            duration: 1000,
            offset: 150,
          });
        }
        const index =  state.tallyRecord.indexOf(currentRecord);
        state.tallyRecord.splice(index, 1);
        localStorage.setItem('tallyRecord', JSON.stringify(state.tallyRecord));

      } else {
        return Message({
          message: '请确认id是否存在',
          type: 'warning',
          duration: 1000,
          offset: 150,
        });
      }
    }
    ,
    removeTag: (state, event) => {
      const currentElement = event.target;
      // console.dir(currentElement)
      let currentSvg: any;
      // 当前的svg图标，+/-
      if (currentElement.tagName === 'svg') {
        currentSvg = currentElement.dataset;
      } else if (currentElement.nodeName === 'use') {
        currentSvg = currentElement.parentNode.dataset;
      }

      if (!currentSvg) {
        // 为空就不运行
        return;
      }
      const isTagExist = state.tallyRecord.filter(
        (item: RecordItem) => {
          return item.tagId === parseInt(currentSvg.id, 10);
        },
      )[0];
      if (currentSvg.type === 'creation') {

        MessageBox.confirm('永久删除该标签?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {


          if (isTagExist) {
            return Message({
              dangerouslyUseHTMLString: true,
              message: `
                  <h3>标签在记账中出现，请删除记账记录后重试</h3>
                  <hr>
                  <ul>
                          <br>
                          <li>
                              <span >备注: &nbsp;</span><span >${isTagExist.note}</span>
                          </li>
                          <li>
                              <span >金额: &nbsp;</span><span >${isTagExist.amount}</span>
                          </li>
                  </ul>`,
              type: 'warning',
              duration: 3000,
              offset: 150,
            });
          }

          const currentTag = state.selfTagsList.filter((item: CreatedTags) => {
            return item.id === parseInt(currentSvg.id, 10);
          })[0];
          const tagIndex = state.selfTagsList.indexOf(currentTag);
          state.selfTagsList.splice(tagIndex, 1);
          localStorage.setItem('selfTagsList', JSON.stringify(state.selfTagsList));

          Message({
            type: 'success',
            message: '删除成功!',
          });
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除',
            offset: 150,
          });
        });

      } else if (currentSvg.type === 'default') {

        MessageBox.confirm('将该标签转移到默认类别, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {

          if (isTagExist) {
            return Message({
              dangerouslyUseHTMLString: true,
              message: `
                  <h3>标签在记账中出现，请删除记账记录后重试</h3>
                  <hr>
                  <ul>
                          <br>
                          <li>
                              <span >备注: &nbsp;</span><span >${isTagExist.note}</span>
                          </li>
                          <li>
                              <span >金额: &nbsp;</span><span >${isTagExist.amount}</span>
                          </li>
                  </ul>`,
              type: 'warning',
              duration: 3000,
              offset: 150,
            });
          }
          const currentTag = state.iconDatas.filter((item: CreatedTags) => {
            return item.id === parseInt(currentSvg.id, 10);
          })[0];
          const tagIndex = state.iconDatas.indexOf(currentTag);
          state.iconDatas.splice(tagIndex, 1);
          state.pendingDatas.push(currentTag);
          localStorage.setItem('iconDatas', JSON.stringify(state.iconDatas));
          localStorage.setItem('pendingDatas', JSON.stringify(state.pendingDatas));
          Message({
            type: 'success',
            message: '转移成功!',
          });
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消转移',
          });
        });


      }
    },
    recoverTag(state, event) {
      const currentElement = event.target;
      // console.dir(currentElement)
      let currentSvg: any;
      if (currentElement.tagName === 'svg') {
        currentSvg = currentElement.dataset;
      } else if (currentElement.nodeName === 'use') {
        currentSvg = currentElement.parentNode.dataset;
      }
      if (!currentSvg) {
        // 为空就不运行
        return;
      }
      if (currentSvg.type === 'default') {
        const currentTag = state.pendingDatas.filter((item: CreatedTags) => {
          return item.id === parseInt(currentSvg.id, 10);
        })[0];
        const tagIndex = state.pendingDatas.indexOf(currentTag);
        state.pendingDatas.splice(tagIndex, 1);
        state.iconDatas.push(currentTag);
        localStorage.setItem('iconDatas', JSON.stringify(state.iconDatas));
        localStorage.setItem('pendingDatas', JSON.stringify(state.pendingDatas));
        Message({
          message: '标签已恢复到默认类别',
          type: 'success',
          duration: 1000,
        });
      }
    },
    search(state, word: string) {
      state.searchWord = word;
    },

  },
  actions: {
  },
  modules: {
  },
});
