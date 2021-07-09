<template>
    <Layout>
        <header>
            <div class="title">
                <Icon class="icon" iconname="calendar"></Icon>
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
                <Icon class="icon search" iconname="search"></Icon>
            </div>
            <div class="month">
                <div class="amount">
                    <p class="number">
                        -900.00
                    </p>
                    <p class="count">
                        {{month}}月统计
                    </p>
                </div>
            </div>
            <div class="earn-pay">
                <div class="earn">
                    <p class="price">100.00</p>
                    <p class="type">{{month}}月收入</p>
                </div>
                <span>|</span>
                <div class="pay">
                    <p class="price">200.00</p>
                    <p class="type">{{month}}月支出</p>
                </div>
            </div>
            <router-link to="/collection" class="add">
                +
            </router-link>
        </header>
        <div class="data">
            <ul>
                <li >
                    <div class="title">
                        <span>
                            2021年7月7日
                        </span>
                        <span>
                            支出:998.00 &nbsp;收入:0.00
                        </span>
                    </div>
                    <ul class="sameDay">
                        <router-link to="/details">
                            <div class="iconWrapper">
                                <Icon class="icon" iconname="book"></Icon>
                                <div>
                                    <p>美容</p>
                                    <p>一二三四五六七八九十</p>
                                </div>
                            </div>
                            <span >
                                -9900000000.00
                            </span>
                        </router-link>
                    </ul>
                </li>
            </ul>
            <p>{{monthData}}</p>
        </div>

    </Layout>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import {Component, Vue, Watch} from 'vue-property-decorator';
import any = jasmine.any;
@Component
  export default class Statistics extends Vue {
      public date = '2021年7月';
      public month = '7';
      public monthPicker = '';
      public fold = false;
      public currentMonth = {};

      @Watch('monthPicker')
      public monthData() {
        if (!this.monthPicker) {
          return;
        }
        this.$store.commit('fetchRecord');
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
        }
        for (const obj of Object.keys(currentMonth)) {
          const count = 0;
          let earn = 0;
          let pay = 0;
          for (const item  of currentMonth[obj].today) {
            if (item.type === 'earn') {
                  earn = earn + parseInt(item.amount, 10);
              } else if (item.type === 'pay') {
                  pay = pay + parseInt(item.amount, 10);
            }
          }
          currentMonth[obj].count = earn - pay;
          currentMonth[obj].earn = earn;
          currentMonth[obj].pay = pay;
        }
        this.currentMonth = currentMonth;

        console.log(currentMonth);

        return monthFilter;
      }

      public beforeMount() {
          this.monthPicker = this.formatDate('');
      }

      public formatDate(date: string ) {
        let formated;
        if (!date) {
          formated = dayjs().format('YYYY-MM');
        } else {
          formated = dayjs(date).format('YYYY-MM');
        }
        return formated;
      }

  }
</script>

<style lang='scss' scoped>
    header{
        position:relative;
        background: #212121;
        padding: 20px 10px 20px 10px;
        color: #e8e8e8;
        >.title{
            display: flex;
            justify-content: space-between;
            font-size: 20px;
            >.icon{
                width:20px;
                height: 20px;
                color: #e8e8e8;
            }
            >.date-show{
                cursor:pointer;
                user-select: none;
            }
            >.search{
                transform: rotateY(180deg);
            }
            .month-picker{
                width: 80px;
                padding: 0;


                ::v-deep >.el-input__inner{
                    padding: 0 0 0 0px ;
                    background: transparent;
                    text-align: center;
                    border: none;
                    color:#e8e8e8;
                    font-size: 20px;
                }
                ::v-deep >.el-input__prefix{
                    i::before{
                        content:'';
                    }
                }
            }
        }
        >.month{
            margin-top: 30px;
            .amount{
                .number{
                    font-size: 30px;
                }
                .count{
                    font-size:14px;
                }
            }
        }
        >.earn-pay{
            margin-top: 30px;
            display:flex;
            justify-content:space-around;
            span{
                font-size: 50px;
                font-weight: 300;
                position:relative;
                top: -10px;
            }
            .earn,.pay{
                .price{
                    font-size: 25px;
                }
                .type{
                    font-size: 14px;
                }
            }
        }
        >.add{
            color:white;
            font-size: 50px;
            background: #212121;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            justify-content:center;
            align-items:center;
            position: absolute;
            bottom: -500px;
            right: 50px;
        }
    }
    .data{
        >ul{
            >li{
                .title{
                    padding: 5px 10px;
                    display: flex;
                    justify-content:space-between;
                    font-size: 14px;
                    color: #9a9a9a;
                }
                .sameDay{
                    a{
                        border-top: 1px solid #e2e2e2;
                        padding: 10px 1%;
                        display: flex;
                        justify-content:space-between;
                        align-items:center;
                        background: white;
                        >span{
                            font-size: 20px;
                            font-weight: 600;
                            width: 40%;
                            text-align:right;
                            white-space:nowrap;
                            overflow-x:auto;
                        }
                        .iconWrapper{
                            max-width: 50%;
                            display: flex;
                            justify-content:space-between;
                            >.icon{
                                background: #212121;
                                color:#e5e5e5;
                                width: 40px;
                                height: 40px;
                                border-radius: 50%;
                                padding: 6px;
                                flex-shrink: 0;
                            }
                            >div{
                                margin-left: 5%;
                                text-align: left;

                                p:nth-child(0n+1){
                                    font-size: 16px;
                                    font-weight: 600;
                                }
                                p:nth-child(0n+2){
                                    font-size: 14px;
                                    color: #9e9e9e;
                                    width: 100px;
                                    overflow-x:auto;
                                    white-space:nowrap;
                                    &::-webkit-scrollbar {
                                        /*滚动条整体样式*/
                                        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
                                        height: 1px;
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


</style>
