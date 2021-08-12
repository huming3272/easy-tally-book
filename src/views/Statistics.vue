<template>
    <Layout class="layout">
        <header>
            <div class="title">
                <router-link to="/calendar">
                    <Icon class="icon" iconname="calendar"></Icon>
                </router-link>
                <span class="date-show">
                    <el-date-picker class="month-picker"
                                    v-model="monthPicker"
                                    type="month"
                                    placeholder="选择月"
                                    ref="monthPicker"
                                    :editable=false
                                    :clearable=false
                                    @focus="fold=true"
                                    @blur='fold=false'
                    >
                    </el-date-picker>
                    <span v-if="fold">▲</span>
                    <span v-else>▼</span>

                </span>
                <router-link to="search">
                    <Icon class="icon search" iconname="search"></Icon>
                </router-link>

            </div>
            <div class="month">
                <div class="amount">
                    <p class="number">
                        {{monthCount.count}}
                    </p>
                    <p class="count">
                        {{currentMonth}}月统计
                    </p>
                </div>
            </div>
            <div class="earn-pay">
                <div class="earn">
                    <p class="price">{{monthCount.earn}}</p>
                    <p class="type">{{currentMonth}}月收入</p>
                </div>
                <div class="pay">
                    <p class="price">{{monthCount.pay}}</p>
                    <p class="type">{{currentMonth}}月支出</p>
                </div>
            </div>

        </header>
        <div class="data">
            <ul>
                <li v-for="(oneday,index) in monthData" :key="index">
                    <div class="title">
                        <span>
                            {{oneday.name}}
                        </span>
                        <span>
                            支出:{{oneday.pay}} &nbsp;收入:{{oneday.earn}}
                        </span>
                    </div>
                    <ul class="sameDay">
                        <router-link v-for="(item,index) in oneday.today" :key="index" :to="`/details?id=${item.id}`">
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
                </li>
                <p>到底啦</p>
            </ul>
        </div>
        <router-link to="/collection" class="add">
            +
        </router-link>
    </Layout>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import toFloat from '@/lib/toFloat.ts';
import * as math from 'mathjs';
import {Component, Vue, Watch} from 'vue-property-decorator';


@Component
export default class Statistics extends Vue {
  public monthPicker = '';
  public fold = false;

  get currentMonth() {
    const currentMonth = parseInt(this.formatDate(this.monthPicker).split('-')[1], 10);
    return currentMonth;
  }

  // @Watch('monthPicker')
  get monthData() {
    if (!this.monthPicker) {
      return;
    }

    const monthFilter = this.$store.state.tallyRecord.filter((item: RecordItem) => {
      return item.date.indexOf(this.formatDate(this.monthPicker)) > -1;
    }).sort((item1: RecordItem, item2: RecordItem) => {
      return dayjs(item2.date).valueOf() - dayjs(item1.date).valueOf();
    });


    const currentMonth = {} as any;
    for (const item of monthFilter) {
      const arr = [];
      arr.push(item);
      if (currentMonth.hasOwnProperty(item.date)) {
        currentMonth[item.date].today.push(item);
      } else {
        currentMonth[item.date] = {};
        currentMonth[item.date].today = arr;
      }
      currentMonth[item.date].name = item.date;
    }
    for (const obj of Object.keys(currentMonth)) {
      let earn = 0;
      let pay = 0;
      for (const item of currentMonth[obj].today) {
        if (item.type === 'earn') {
          earn = Number(this.exactingFloat(Number(earn + Number(item.amount))));
        } else if (item.type === 'pay') {
          pay = Number(this.exactingFloat(Number(pay + Number(item.amount))));
        }
      }

      currentMonth[obj].count =  toFloat(Number(this.exactingFloat(earn - pay)));
      currentMonth[obj].earn = toFloat(earn);
      currentMonth[obj].pay = toFloat(pay);

    }

    return currentMonth;
  }

  get monthCount() {
    const monthCount = {
      count: 0,
      earn: 0,
      pay: 0,
    };
    let result = {};

    for (const obj of Object.keys(this.monthData)) {
      monthCount.count = Number(this.exactingFloat(monthCount.count + Number(this.monthData[obj].count)));
      monthCount.earn = Number(this.exactingFloat(monthCount.earn + Number(this.monthData[obj].earn)));
      monthCount.pay = Number(this.exactingFloat(monthCount.pay + Number(this.monthData[obj].pay)));
    }
    result = {
      count: toFloat(monthCount.count),
      earn: toFloat(monthCount.earn),
      pay: toFloat(monthCount.pay),
    };
    return result;
  }


  public beforeMount() {
    this.monthPicker = this.formatDate('');
    this.$store.commit('fetchTags');
    this.$store.commit('fetchRecord');

  }

  public formatDate(date: string) {
    let formated = '';
    if (!date) {
      formated = dayjs().format('YYYY-MM');
    } else {
      formated = dayjs(date).format('YYYY-MM');
    }
    return formated;
  }
  public exactingFloat(value: number) {
    const precision = 14;
    return math.format(value, precision);
  }

}
</script>

<style lang='scss' scoped>
    .layout {
        position: relative;

        > .add {
            color: white;
            font-size: 50px;
            background: #212121;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            bottom: 80px;
            right: 30px;
        }
    }

    header {
        background: #212121;
        padding: 20px 10px 20px 10px;
        color: #e8e8e8;

        > .title {
            display: flex;
            justify-content: space-between;
            font-size: 20px;
            >a{
                > .icon {
                    width: 20px;
                    height: 20px;
                    color: #e8e8e8;
                }
                > .search {
                    transform: rotateY(180deg);
                }
            }


            > .date-show {
                cursor: pointer;
                user-select: none;
            }



            .month-picker {
                width: 80px;
                padding: 0;


                ::v-deep > .el-input__inner {
                    padding: 0 0 0 0px;
                    background: transparent;
                    text-align: center;
                    border: none;
                    color: #e8e8e8;
                    font-size: 20px;
                }

                ::v-deep > .el-input__prefix {
                    i::before {
                        content: '';
                    }
                }
            }
        }

        > .month {
            margin-top: 30px;

            .amount {
                .number {
                    font-size: 30px;
                }

                .count {
                    font-size: 14px;
                }
            }
        }

        > .earn-pay {
            margin-top: 30px;
            display: flex;
            justify-content: space-around;

            span {
                font-size: 50px;
                font-weight: 300;
                position: relative;
                top: -10px;
            }

            .earn{

                border-right:2px solid ;
            }
            .earn, .pay {
                width:50%;
                .price {
                    font-size: 25px;
                }
                .type {
                    font-size: 14px;
                }
            }
        }

    }

    .data {
        height: calc(100vh - 310px);
        overflow: auto;

        & {
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
        > ul {
            padding-bottom: 50px;

            > p {
                font-size: 30px;
            }

            > li {
                .title {
                    padding: 5px 10px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #9a9a9a;
                }

                .sameDay {
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
