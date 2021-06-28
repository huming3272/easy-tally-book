<template>
    <Layout>
        <div class="title">
            <h1>标签编辑</h1>
            <Icon class="icon" iconname="add" @click="addTag"></Icon>
        </div>
        <div class="typeWrapper">
            <ul @click="removeTag">
                <li class="typeTitle">
                    自创建类别 <span v-if="selfTagsList.length === 0">(暂无)</span>
                </li>
                <li v-for="item in selfTagsList" :key="item.id">

                    <div class="type">
                        <Icon class="sub" iconname="sub" :data-id="item.id" :data-type="item.type"></Icon>
                        <router-link :to="{path:'createTag',query:{id:item.id}}">
                            <div class="typeRight">
                                <span>{{item.name}}</span>
                                <div class="iconWrapper">
                                    <Icon class="icon" :iconname="item.src"></Icon>
                                </div>
                            </div>
                        </router-link>

                    </div>

                </li>
                <!--                -->
                <li class="typeTitle">
                    默认类别
                </li>
                <li v-for="item in sortIconDatas" :key="item.id">
                    <div class="type">
                        <Icon class="sub" iconname="sub" :data-id="item.id" :data-type="item.type"></Icon>
                        <div class="typeRight">
                            <span>{{item.name}}</span>
                            <div class="iconWrapper">
                                <Icon class="icon" :iconname="item.src"></Icon>
                            </div>

                        </div>
                    </div>
                </li>
            </ul>
            <!--                -->
            <ul @click="recoverTag">
                <li class="typeTitle">
                    待恢复默认类别 <span v-if="pendingDatas.length === 0">(暂无)</span>
                </li>
                <li v-for="item in pendingDatas" :key="item.id">
                    <div class="type">
                        <Icon class="add" iconname="add" :data-id="item.id" :data-type="item.type"></Icon>
                        <div class="typeRight">
                            <span>{{item.name}}</span>
                            <div class="iconWrapper">
                                <Icon class="icon" :iconname="item.src"></Icon>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </Layout>
</template>

<script lang="ts">
import {Message} from 'element-ui';
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class Information extends Vue {
  public iconDatas = JSON.parse(localStorage.getItem('iconDatas') || '[]');
  public pendingDatas = JSON.parse(localStorage.getItem('pendingDatas') || '[]');
  public selfTagsList = JSON.parse(localStorage.getItem('selfTagsList') || '[]');
  public tallyRecord = JSON.parse(localStorage.getItem('tallyRecord') || '[]');

  get sortIconDatas() {
    const array = this.iconDatas.sort((item1: CreatedTags, item2: CreatedTags) => {
      return item1.id - item2.id;
    });
    return array;
  }


  public addTag() {
    this.$router.replace('/createTag');
  }

  public removeTag(event: any) {
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

      this.$confirm('永久删除该标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {

        const isTagExist = this.tallyRecord.filter(
          (item: RecordItem) => {
            return item.tagId === parseInt(currentSvg.id, 10);
          },
        )[0];
        if (isTagExist) {
          return this.$message({
            dangerouslyUseHTMLString: true,
            message: `
                  <h3>发现标签在记账中出现，请删除记账记录后重试</h3>
                  <hr>
                  <ul>
                          <li>
                              <span >标签名:</span><span >${isTagExist.name}</span>
                          </li>
                          <li>
                              <span >备注:</span><span >${isTagExist.note}</span>
                          </li>
                          <li>
                              <span >金额:</span><span >${isTagExist.amount}</span>
                          </li>
                  </ul>`,
            type: 'warning',
            duration: 3000,
            offset: 150,
          });
        }

        const currentTag = this.selfTagsList.filter((item: CreatedTags) => {
          return item.id === parseInt(currentSvg.id, 10);
        })[0];
        const tagIndex = this.selfTagsList.indexOf(currentTag);
        this.selfTagsList.splice(tagIndex, 1);
        localStorage.setItem('selfTagsList', JSON.stringify(this.selfTagsList));

        this.$message({
          type: 'success',
          message: '删除成功!',
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });

    } else if (currentSvg.type === 'default') {

      this.$confirm('将该标签转移到默认类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const currentTag = this.iconDatas.filter((item: CreatedTags) => {
          return item.id === parseInt(currentSvg.id, 10);
        })[0];
        const tagIndex = this.iconDatas.indexOf(currentTag);
        this.iconDatas.splice(tagIndex, 1);
        this.pendingDatas.push(currentTag);
        localStorage.setItem('iconDatas', JSON.stringify(this.iconDatas));
        localStorage.setItem('pendingDatas', JSON.stringify(this.pendingDatas));
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });


    }
  }

  public recoverTag(event: any) {
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
      const currentTag = this.pendingDatas.filter((item: CreatedTags) => {
        return item.id === parseInt(currentSvg.id, 10);
      })[0];
      const tagIndex = this.pendingDatas.indexOf(currentTag);
      this.pendingDatas.splice(tagIndex, 1);
      this.iconDatas.push(currentTag);
      localStorage.setItem('iconDatas', JSON.stringify(this.iconDatas));
      localStorage.setItem('pendingDatas', JSON.stringify(this.pendingDatas));
      this.$message({
        message: '标签已恢复到默认类别',
        type: 'success',
        duration: 1000,
      });
    }
  }


}
</script>

<style lang='scss' scoped>
    .key,.value{
        font-size: 40px;
    }
    .key {
        color: #FE9A2E;
    }

    .value {
        color: teal;
    }

    .title {
        box-shadow: 0 -4px 5px -5px rgba(0, 0, 0, 0.2) inset;
        position: relative;
        padding-bottom: 20px;
        background: #eeeeee;
        position: fixed;
        width: 100%;
        max-width: 500px;

        h1 {
            text-align: center;
            font-size: 20px;
            padding: 22px 0;
            background: #ffffff;
            font-weight: normal;
        }

        ::v-deep > .icon {
            cursor: pointer;
            width: 20px;
            height: 20px;
            color: black;
            position: absolute;
            top: 28%;
            right: 5%;

        }
    }

    .typeWrapper {
        margin-top: 85px;
        color: #b4b4b4;
        font-size: 18px;
        text-align: left;
        background: #ffffff;

        .typeTitle {
            font-size: 16px;
            padding: 15px 12px;
        }

        > ul {
            > li {
                border-bottom: 1px solid #e2e2e2;
                padding: 0 12px;

                .type {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 0;

                    > .sub {
                        width: 30px;
                        height: 30px;
                        color: #d81e06;
                        background: white;
                        cursor: pointer;
                    }

                    > .add {
                        width: 30px;
                        height: 30px;
                        color: white;
                        background: #93df57;
                        border-radius: 50%;
                        padding: 2px;
                        cursor: pointer;
                    }

                    > a {
                        flex-grow: 1;

                    }

                    .typeRight {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        text-align: right;

                        > .iconWrapper {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 35px;
                            height: 35px;
                            background: #212121;
                            border-radius: 50%;

                            .icon {
                                width: 20px;
                                height: 20px;
                                color: white;

                            }
                        }

                        > span {
                            color: #000000;
                            padding-right: 20px;
                        }

                    }

                }

            }
        }
    }

</style>
