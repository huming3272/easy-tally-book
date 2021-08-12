<template>
    <div class="calendarWrapper">
        <div class="titleWrapper">
            <div class="title">
                <Icon class="icon" iconname="toBack" @click="toBack"></Icon>
                <span>选择日期</span>
            </div>
            <el-calendar class="calendar" v-model="value">
                <template
                        slot="dateCell"
                        slot-scope="{date, data}">
                    <p> <!--这里原本有动态绑定的class，去掉-->
                        {{ data.day.split('-').slice(2).join('') }}<br/> {{hasRecord(data.day)}}
                    </p>
                </template>
            </el-calendar>
        </div>
        <div class="data">
            <div class="amount" v-if="seletedData.today.length !== 0">
                <div class="title">
                    <div class="date">
                        {{seletedData.date}}
                    </div>
                    <div class="money">
                        <span>支出:
                            <span class="pay">{{seletedData.pay}}</span>
                        </span>
                        <span>收入:
                            <span class="earn">{{seletedData.earn}}</span>
                        </span>
                        <span>盈亏:
                            <span
                                    :class="[seletedData.count >=0?'earn':'pay']"> {{seletedData.count}}</span>
                        </span>
                    </div>
                </div>
                <ul class="sameDay">
                    <router-link v-for="(item,index) in seletedData.today" :key="index" :to="`/details?id=${item.id}`">
                        <div class="iconWrapper">
                            <Icon class="icon" :iconname="item.iconName"></Icon>
                            <div>
                                <p>{{item.name}}</p>
                                <p>{{item.note}}</p>
                            </div>
                        </div>
                        <span>
                                {{item.amount}}
                            </span>
                    </router-link>
                </ul>
            </div>

            <div v-else class="mask">
                <Icon class="icon" iconname="noTally"></Icon>
                <p>当天无账单哟</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import dayjs from 'dayjs';
import formatTsNum from '@/lib/formatTsNum';
import mathjs from 'mathjs';
import * as math from 'mathjs';

@Component
export default class Calendar extends Vue {
  public value = new Date();
  public tallyRecord = [] as RecordItem[];
  public type = 'pay';

  get seletedData() {
    const YMD = dayjs(this.value).format('YYYY-MM-DD');
    const currentDay = YMD.split('-');
    currentDay[0] = currentDay[0] + '年';
    currentDay[1] = currentDay[1] + '月';
    currentDay[2] = currentDay[2] + '日';

    const currentData = this.tallyRecord.filter((item: RecordItem) => {
      return item.date === YMD;
    });
    if (!currentData) {
      return currentData;
    }
    let earn = 0;
    let pay = 0;
    for (const item of currentData) {
      if (item.type === 'earn') {
        earn = earn + Number(formatTsNum(this.exactingFloat(Number(item.amount))));

      } else if (item.type === 'pay') {
        pay = pay + Number(formatTsNum(this.exactingFloat(Number(item.amount))));
      }
    }

    const groupData = {
      date: currentDay.join(''),
      today: currentData,
      earn,
      pay,
      count: this.exactingFloat(earn - pay),
    };
    // console.log(groupData.earn,groupData.pay,'group')

    return groupData;
  }


  public beforeMount() {
    this.$store.commit('fetchTags');
    this.$store.commit('fetchRecord');
    this.tallyRecord = this.$store.state.tallyRecord;
  }

  public exactingFloat(value: number) {
    // console.log(value,'count2')
    const precision = 16;
    let result = math.format(value, precision);
    if (result.indexOf('e')) {

      const formatNumber = Number(result);
      result = formatNumber.toLocaleString();

      return result;
    } else {
      return result;
    }


  }

  public toBack() {
    this.$router.back();
  }

  public hasRecord(date: string) {
    const result = '💡';
    for (const item of this.tallyRecord) {
      if (item.date === date) {
        return result;
      }
    }
  }
}
</script>

<style lang='scss' scoped>
    .is-selected {
        color: #1989FA;
    }

    .calendarWrapper {
        > .titleWrapper {
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

            .calendar {
                ::v-deep {
                    .el-calendar-table td.is-selected {
                        /*background-color: blue !important;*/
                    }

                    .el-calendar-day {
                        height: 50px;
                    }
                }
            }
        }

        > .data {
            > .amount {
                > .title {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #a9a9a9;
                    padding: 10px 5px;

                    > .money {
                        > span {
                            padding-left: 10px;
                        }

                         .pay {
                            color: green;
                        }

                         .earn {
                            color: red;
                        }
                    }

                }

                > .sameDay {
                    height: calc(100vh - 557px);
                    overflow: auto;
                    a {
                        border-top: 1px solid #e2e2e2;
                        padding: 10px 1%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: white;

                        > span {
                            font-size: 20px;
                            font-weight: 600;
                            width: 40%;
                            text-align: right;
                            white-space: nowrap;
                            overflow-x: auto;
                        }

                        .iconWrapper {
                            max-width: 50%;
                            display: flex;
                            justify-content: space-between;

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

                                p:nth-child(0n+1) {
                                    font-size: 16px;
                                    font-weight: 600;
                                }

                                p:nth-child(0n+2) {
                                    font-size: 14px;
                                    color: #9e9e9e;
                                    width: 100px;
                                    overflow-x: auto;
                                    white-space: nowrap;

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
                        }
                    }
                }
            }

            .mask {
                background: radial-gradient(ellipse at center, #7f7a7b 0%, #ebeef5 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
                color: #5e5e5e;
                font-size: 30px;
                padding: 20px 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: calc(100vh - 518px);

                > .icon {
                    width: 80px;
                    height: 80px;
                }
            }
        }

    }

    @media screen and (min-width: 350px) {
        .sameDay {
            a {
                padding: 10px 10px !important;
            }
        }
    }
</style>
