import Vue from 'vue';
import Vuex from 'vuex';
import iconDatas from '@/constant/iconDatas.ts';
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
      state.selfTagsList.push(newTags);
      localStorage.setItem('selfTagsList', JSON.stringify(state.selfTagsList));
      Message({
        message: '标签添加成功',
        type: 'success',
        duration: 2000,
        offset: 150,
      });
    },
    updateTags: (state, payload: {id: number, newTags: string}) => {
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
      state.tallyRecord = JSON.parse(localStorage.getItem('tallyRecord') || '[]');
    },
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

      if (currentSvg.type === 'creation') {

        MessageBox.confirm('永久删除该标签?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {

          const isTagExist = state.tallyRecord.filter(
            (item: RecordItem) => {
              return item.tagId === parseInt(currentSvg.id, 10);
            },
          )[0];
          if (isTagExist) {
            return Message({
              dangerouslyUseHTMLString: true,
              message: `
                  <h3>发现标签在记账中出现，请删除记账记录后重试</h3>
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
            message: '删除成功!',
          });
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除',
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
  },
  actions: {
  },
  modules: {
  },
});
