<template>
    <div class="searchWrapper">
        <div class="title">
            <Icon class="back" iconname="toBack" @click="back"></Icon>
            <input type="text" placeholder="请输入类别/备注/金额" v-model="value">
            <button @click="search">确认</button>
        </div>
        <ul v-if="sameType.length >0" class="sameTag">
            <router-link v-for="(item,index) in sameType" :key="index" :to="`/details?id=${item.id}`">
                <div class="iconWrapper">
                    <Icon class="icon" :iconname="item.iconName"></Icon>
                    <div>
                        <p>{{item.name}}</p>
                        <p>{{item.note}}</p>
                    </div>
                </div>
                <p>{{item.amount}}</p>
            </router-link>
        </ul>
        <div v-else class="mask">
            <Icon class="icon" iconname="noTally"></Icon>
            <p>当前数据不存在</p>
        </div>

    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class Search extends Vue {
  public value = '';
  public sameType: RecordItem[] = [];

  public back() {
    this.$router.back();
  }
  public beforeMount() {
      this.$store.commit('fetchTags');
      this.$store.commit('fetchRecord');
      this.value = this.$store.state.searchWord || '';

  }

  public search() {
    if (!this.value) {
      return this.$message(
        {
          message: '请输入数据',
          type: 'warning',
          duration: 1000,
          offset: 200,
        },
      );
    }
    this.$store.commit('search', this.value);
    this.sameType = this.$store.state.tallyRecord.filter(
        (item: RecordItem) => {
          return item.search.indexOf(this.value) > -1;
        },
      );
    this.$message(
      {
        message: '搜索完毕',
        type: 'success',
        duration: 1000,
        offset: 200,
      },
    );
    }
}
</script>

<style lang='scss' scoped>
    .searchWrapper {
        >.title{
            position:relative;
            background: #dddddd;
            padding: 10px 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            >.back{
                color: #212121;
                width: 20px;
                height: 20px;
                flex-shrink: 0;
            }

            >input{
                /*flex:0 30%;*/
                border-radius: 30px;
                border:none;
                padding: 10px 0px 10px 5%;
                font-size: 18px;
                background: #ffffff;
                max-width: 80%;
            }
            >button{
                border:none;
                background:#212121;
                color: #e5e5e5;
                padding: 5px 10px;
                border-radius: 20px;

                flex-shrink: 0;
            }
        }
        > .sameTag {
            height: calc(100vh - 61px);
            overflow: auto;
            a {
                border-top: 1px solid #e2e2e2;
                padding: 10px 1%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: white;
                p{
                    &::-webkit-scrollbar {
                        /*滚动条整体样式*/
                        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
                        height: 5px;
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
                > p {
                    font-size: 20px;
                    font-weight: 600;
                    width: 40%;
                    text-align: right;
                    word-break:break-all;
                }

                .iconWrapper {
                    max-width: 50%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    > .icon {
                        background: #212121;
                        color: #e5e5e5;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        padding: 6px;
                        flex-shrink: 0;
                    }

                    > div {
                        margin-left: 5%;
                        text-align: left;
                        p{
                            width: 100px;
                            word-break:break-all;
                        }

                        p:nth-child(0n+1) {
                            font-size: 16px;
                        /*    font-weight: 600;*/
                        /*    !*overflow-x: auto;*!*/
                        /*    white-space: nowrap;*/
                        /*    width:80%;*/
                            border-bottom: 1px solid #eee;
                        }

                        p:nth-child(0n+2) {
                            font-size: 14px;
                        /*    color: #9e9e9e;*/
                        /*    width: 100px;*/
                        /*    overflow-x: auto;*/
                        /*    white-space: nowrap;*/
                        }


                    }
                }
            }
        }
        .mask {
            background: radial-gradient(ellipse at center, #7f7a7b 0%, #ebeef5 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
            height: calc(100vh - 61px);
            color: #5e5e5e;
            font-size: 30px;
            padding: 20px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            > .icon {
                width: 80px;
                height: 80px;
            }
        }
    }
    @media screen and (min-width: 350px) {
        .sameTag {
            a {
                padding: 10px 10px !important;
            }
        }
    }
</style>
