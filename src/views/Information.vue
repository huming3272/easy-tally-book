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
                        <router-link :to="{path:'editTag',query:{id:item.id}}">
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
  public iconDatas = [] as CreatedTags[];
  public pendingDatas = [] as CreatedTags[];
  public selfTagsList = [] as CreatedTags[];
  public tallyRecord = [] as RecordItem[];

  public beforeMount() {
    this.$store.commit('fetchTags');
    this.iconDatas = this.$store.state.iconDatas;
    this.pendingDatas = this.$store.state.pendingDatas;
    this.selfTagsList = this.$store.state.selfTagsList;
  }
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
    this.$store.commit('fetchRecord');
    this.$store.commit('removeTag', event);

  }

  public recoverTag(event: any) {
    this.$store.commit('recoverTag', event);
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
        /*background: #eeeeee;*/
        /*position: fixed;*/
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
        /*margin: 85px 0 68px 0;*/
        color: #b4b4b4;
        font-size: 18px;
        text-align: left;
        background: #ffffff;
        height: calc(100vh - 158px);
        overflow-y:auto;
        .typeTitle {
            font-size: 16px;
            padding: 15px 12px;
        }

        > ul {
            > li {
                border-bottom: 1px solid #e2e2e2;
                padding: 0 12px;
                background: white;
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
        &::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 3px;
        }

        &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: #535353;
        }

        &::-webkit-scrollbar-track {
            /*滚动条里面轨道*/
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            background: #ededed;
        }
    }

</style>
