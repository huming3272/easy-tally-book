<template>
    <div class="detail">
        <div class="title">
            <Icon class="icon" iconname="toBack" @click="toBack"></Icon>
            <span>详情</span>
        </div>
        <div class="content">
            <div class="synopsis">
                <div class="left">
                    <Icon :iconname="currentDay.iconName"></Icon>
                    <span>{{currentDay.name}}</span>
                </div>
                <span class="price">
                    {{currentDay.amount}}
                </span>
            </div>
            <div class="particular">
                <dl class="type">
                    <dt>收支类型</dt>
                    <dd>{{currentDay.parseType}}</dd>
                </dl>
                <dl class="date">
                    <dt>日期</dt>
                    <dd>{{currentDay.parseDate}}</dd>
                </dl>
                <dl class="note">
                    <dt>备注</dt>
                    <dd>{{currentDay.note}}</dd>
                </dl>
            </div>
        </div>
        <div class="control">
            <button @click="editRecord">
                编辑
            </button>
            <button @click="deleteRecord">
                删除
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import toFloat from '@/lib/toFloat.ts';
import dayjs from 'dayjs';
import {Component, Vue} from 'vue-property-decorator';
import {Message, MessageBox} from 'element-ui';

@Component
export default class Details extends Vue {
  public id = Number(this.$route.query.id);
  public currentDay = {};

  public toBack() {
    this.$router.back();
  }

  public beforeMount() {
    this.$store.commit('fetchTags');
    this.$store.commit('fetchRecord');

    const currentDay = this.$store.state.tallyRecord.filter((item: RecordItem) => {
      return item.id === this.id;
    })[0];
    if (this.id && currentDay) {
      if (currentDay.type === 'pay') {
        currentDay.parseType = '支出';
      } else if (currentDay.type === 'earn') {
        currentDay.parseType = '收入';
      }
      const date = dayjs(currentDay.date).format('YYYY-MM-DD').split('-');
      date[0] = date[0] + '年';
      date[1] = date[1] + '月';
      date[2] = date[2] + '日';
      currentDay.parseDate = date.toString().replace(/,/g, '');
      this.currentDay = currentDay;
    } else {
      return this.$message({
        message: '请确认数据是否存在',
        type: 'warning',
        duration: 1000,
        offset: 200,
      });
    }
  }

  public editRecord() {
    this.$router.push(`/editRecord?id=${this.id}`);
  }

  public deleteRecord() {


    this.$confirm('永久删除该记录?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      if (this.id) {
        this.$store.commit('deleteRecord', this.id);
        setTimeout(() => {
          this.$router.back();
        }, 4000);
      } else {
        this.$message({
          message: '请确认id是否正确',
          type: 'warning',
          duration: 1000,
          offset: 150,
        });
      }
      this.$message({
        type: 'success',
        message: '删除成功,将返回上一页!',
        duration: 1000,
        offset: 150,
      });
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除',
        duration: 1000,
        offset: 150,
      });
    });


  }
}
</script>

<style lang='scss' scoped>
    .detail {
        background: #eee;

        > .title {
            /*box-shadow: 0 -4px 5px -5px rgba(0, 0, 0, 0.2) inset;*/
            display: flex;
            justify-content: space-between;
            align-items: center;

            position: relative;
            background: #fff;
            padding: 20px 5% 20px 5%;

            ::v-deep > .icon {
                width: 20px;
                height: 20px;
                color: black;
                /*    position:absolute;*/
                /*    top: 36%;*/
                /*    left: 5%;*/
                cursor: pointer;
            }

            > span {
                font-size: 20px;
                font-weight: 600;
                flex-grow: 1;
                text-align: left;
                padding-left: 10%;
            }
        }

        > .content {
            margin-top: 20px;
            /*padding: 0 20px;*/

            height: calc(100vh - 153px);

            .synopsis {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 16px;
                font-weight: 600;
                padding: 10px 20px;
                border-bottom: 1px solid #ebebeb;
                background: white;

                .left {
                    width: 50%;
                    display: flex;
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

                    > span {
                        padding-left: 10px;
                        width: 80%;
                        white-space: nowrap;
                        overflow-x: auto;
                        text-align: left;
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
                }

                > .price {
                    width: 50%;
                    text-align: right;
                    white-space: nowrap;
                    overflow-x: auto;
                }
            }

            > .particular {
                padding: 0 20px;
                background: white;

                > dl {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;

                    > dt {
                        font-size: 16px;
                    }

                    > dd {
                        font-size: 14px;
                        font-weight: 600;
                    }
                }
            }
        }

        > .control {
            background: white;
            border-top: 1px solid #cccccc;
            display: flex;
            padding: 10px 0;

            > button {
                border: 0;
                background: transparent;
                width: 50%;
                padding: 10px 0;
                font-size: 18px;
                font-weight: 500;
            }

            > button:nth-child(0n+1) {
                border-right: 1px solid #cecece;
            }
        }
    }

</style>
