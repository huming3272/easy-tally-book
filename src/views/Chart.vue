<template>
    <Layout>
        <div class="ChartWrapper">
            <div class="title">
                <Tabs :value.sync="tabType"></Tabs>
                <Icon class="icon" :iconname="chartType" @click="changeChartType"></Icon>
            </div>
            <div class="dateWrapper">
                <button :class="{dateSelected:dateSelected==='week'}" @click="changeDate('week')">周</button>
                <button :class="{dateSelected:dateSelected==='month'}" @click="changeDate('month')">月</button>
                <button :class="{dateSelected:dateSelected==='year'}" @click="changeDate('year')">年</button>
            </div>
            <div class="periodWrapper">
                <div class="period week" ref="period">
                    <el-tabs class="tabs" v-model="activeName" @tab-click="dateClick">
                        <el-tab-pane v-for="(item,index) in dateGroup.dateShow" :label="item.name" :name="String(index)"
                                     :key="index"></el-tab-pane>
                    </el-tabs>
                </div>
                <Echarts :options="chartOption" :chartSize="chartSize" ref="echart"></Echarts>
                <div class="rankWrapper">
                    <h2>
                        支出排行榜
                    </h2>
                    <ul class="rank" v-if="dateGroup.currentData.types.length >0">
                        <li v-for="(item,index) in dateGroup.currentData.types" :key="index">
                            <Icon class="icon" :iconname="item.typeIcon"></Icon>
                            <div class="dataWrapper">
                                <div class="data">
                                    <div class="dataLeft">
                                        <span class="name">
                                        {{item.typeName}}
                                        </span>
                                        <span class="percent">
                                       {{item.typePercent}}%
                                        </span>
                                    </div>
                                    <span class="typeCount">{{item.typeCount}}</span>
                                </div>
                                <el-progress :percentage="Number(item.typePercent)" color="#212121" :stroke-width = 10
                                             :show-text="false"></el-progress>
                            </div>
                        </li>
                    </ul>
                    <div class="mask" v-else>
                        <Icon class="icon" iconname="noTally"></Icon>
                        <p>该时间段无账单哟</p>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>

<script lang="ts">
import Echarts from '@/components/Echarts.vue';
import dayjs from 'dayjs';
import {Component, Vue, Watch} from 'vue-property-decorator';
import Tabs from '@/components/Tabs.vue';
import toFloat from '@/lib/toFloat';
import formatTsNum from '@/lib/formatTsNum';
import * as math from 'mathjs';


@Component(
  {
    components: {Tabs, Echarts},
  },
)
export default class Chart extends Vue {
  public tabType = 'pay';
  public chartType = 'pieChart';
  public dateSelected = 'week';
  public dateSelectedState = '';
  public activeName = '';
  public chartSize = 'normal';
  public tallyRecord = [] as RecordItem[];
  public chartOption = {};

  public dateGroup = {
    dateShow: [] as any,
    currentDate: [] as string[],
    currentData: {
      record: [] as RecordItem[],
      unitCount: [] as string[],
      dateCount: '0',
      types: [] as Array<{
        typeCount: string,
        typeIcon: string,
        typeName: string,
        typePercent: string,
      }>,
    },
  };
  public weekGroup = {
    weekShow: [] as any,
    currentWeekDate: [] as string[],
    currentWeekData: {
      record: [] as RecordItem[],
      dayCount: [] as string[],
      weekCount: '0',
      types: [] as Array<{
        typeCount: string,
        typeIcon: string,
        typeName: string,
        typePercent: string,
      }>,
    },
  };


  @Watch('tabType', {immediate: false})
  public watchTab() {
    this.fetchRecord();
    this.dateGroup.currentDate = this.dateGroup.dateShow[parseInt(this.activeName, 10)].date;
    if (this.dateSelected === 'week') {
      this.calcWeekGroup();
    } else if (this.dateSelected === 'month') {
      this.calcMonthGroup();
    } else if (this.dateSelected === 'year') {
      this.calcYearGroup();
    }
    this.initOption();


  }

  public beforeMount() {
    this.$store.commit('fetchTags');
    this.$store.commit('fetchRecord');
    this.fetchRecord();
    this.calcWeekGroup();
    this.initOption();


  }

  public mounted() {
    this.scroll();
  }

  /*周*/
  public calcWeekGroup() {
    const today = dayjs();
    const weekShow = [] as any;
    let currentWeekMonday;
    let todaySubMonday = 0;
    const currentWeek = [];

    if (today.day() === 0) {
      todaySubMonday = 6;
    } else {
      todaySubMonday = today.day() - 1;
      //  用减法得到这周的周一，用来之后周减法计算的时候方便时间
    }
    currentWeekMonday = today.subtract(todaySubMonday, 'day');

    for (let i = todaySubMonday; i >= 0; i--) {
      currentWeek.push(today.subtract(i, 'day').format('YYYY-MM-DD'));
    }
    weekShow.push({date: currentWeek, name: '本周'});


    for (let i = 1; i <= 4; i++) {
      // 四周数据
      const monday = currentWeekMonday.subtract(i, 'week');
      const currentWeekData = [];
      for (let n = 0; n <= 6; n++) {
        // 每周从周一开始递增
        currentWeekData.push(monday.add(n, 'day').format('YYYY-MM-DD'));
      }
      weekShow.push({
        date: currentWeekData,
        name: `${currentWeekData[0]}~${currentWeekData[currentWeekData.length - 1]}`,
      });
    }
    // 得到日期组
    weekShow.reverse();

    this.dateGroup.dateShow = weekShow;
    this.dateGroup.currentDate = currentWeek;
    this.activeName = String(this.dateGroup.dateShow.length - 1);
    this.updateWeekGroup();

  }


  public updateWeekGroup() {
    interface Types {
      typeCount: string;
      typeIcon: string;
      typeName: string;
      typePercent: string;
    }

    const currentWeekData = {
      record: [] as RecordItem[],
      dayCount: [] as string[],
      weekCount: '0',
      types: [] as Types[],
    };
    const resolutionWeekData = [] as any;


    for (const date of this.dateGroup.currentDate) {

      const currentDay = JSON.parse(JSON.stringify(this.tallyRecord.filter((item) => {
        return item.date === date;
      })));
      // console.log(currentDay,'currentDay')
      resolutionWeekData.push(currentDay);
    }
    currentWeekData.record = resolutionWeekData;


    for (const today of resolutionWeekData) {
      // console.log(today, '一个today');
      if (!(today instanceof Array)) {
        currentWeekData.dayCount.push(String(0));
      } else if (today instanceof Array) {
        let sameDayCount = 0;
        for (const todayItem of today) {
          sameDayCount = sameDayCount + Number(todayItem.amount);

        }
        // console.log(sameDayCount, 'sameday');
        currentWeekData.dayCount.push(toFloat(sameDayCount) as string);
      }
    }

    // 求周和
    for (const oneday of currentWeekData.dayCount) {
      const dayCount = Number(oneday);

      let weekCount = Number(currentWeekData.weekCount);
      // console.log(weekCount,'weekCount1')
      weekCount = Number(formatTsNum(this.exactingFloat(weekCount + dayCount)));

      currentWeekData.weekCount = toFloat(weekCount) as string;
    }

    const flatWeekData = this.flatten(resolutionWeekData);
    //  扁平化每周的数据

    const typesId = {} as any;

    for (const item of flatWeekData) {
      const tagId = item.tagId.toString();
      if (Object.hasOwnProperty(item.tagId)) {
        return;
      }
      typesId[tagId] = item.tagId;
      //  通过哈希不能有重复的键名进行id去重
    }


    for (const tagId of Object.keys(typesId)) {
      const weekCount = Number(currentWeekData.weekCount);

      const sameType = flatWeekData.filter((item: RecordItem) => {
        return item.tagId === typesId[tagId];
      });
      if (Array.isArray(sameType) && sameType.length > 0) {
        const typeCountArray = sameType.map((item) => {
          return Number(item.amount);
        });
        const typeCount = typeCountArray.reduce((count, item) => {
          return count + item;
        }, 0);
        const type = {
          typeCount: toFloat(typeCount) as string,
          typeIcon: sameType[0].iconName,
          typeName: sameType[0].name,
          typePercent: this.exactingFloat((typeCount / Number(weekCount) * 100)),
        };
          // console.log(typeCount / Number(weekCount),'算百分比')
        currentWeekData.types.push(type);
      }
    }
    currentWeekData.types = currentWeekData.types.sort((item1: Types, item2: Types) => {
      return Number(item2.typeCount) - Number(item1.typeCount);
    });

    this.dateGroup.currentData = {
      record: currentWeekData.record,
      unitCount: currentWeekData.dayCount,
      dateCount: currentWeekData.weekCount,
      types: currentWeekData.types,
    };

  }

  /*月*/
  public calcMonthGroup() {
    const today = dayjs();
    const monthShow = [] as any;
    let currentMonthFirst;
    let todayToMonthFirst = 0;
    const currentMonth = [];

    todayToMonthFirst = parseInt(dayjs().format('DD'), 10) - 1;
    //  和月头的差值

    currentMonthFirst = today.subtract(todayToMonthFirst, 'day');
    // 当前月的第一天

    for (let i = todayToMonthFirst; i >= 0; i--) {
      currentMonth.push(today.subtract(i, 'day').format('YYYY-MM-DD'));
    }
    monthShow.push({date: currentMonth, name: '本月'});
    for (let i = 1; i <= 2; i++) {
      const monthHead = currentMonthFirst.subtract(i, 'month');
      const monthDay = monthHead.daysInMonth();
      const currentMonthData = [];
      for (let n = 0; n < monthDay; n++) {
        currentMonthData.push(monthHead.add(n, 'day').format('YYYY-MM-DD'));
      }
      monthShow.push({date: currentMonth, name: (parseInt(monthHead.format('MM'), 10) + '月')});
    }

    // //得到日期组
    monthShow.reverse();
    //
    this.dateGroup.dateShow = monthShow;
    this.dateGroup.currentDate = currentMonth;
    this.activeName = String(this.dateGroup.dateShow.length - 1);
    this.updateMonthGroup();

  }

  public updateMonthGroup() {
    interface Types {
      typeCount: string;
      typeIcon: string;
      typeName: string;
      typePercent: string;
    }

    const currentMonthData = {
      record: [] as RecordItem[],
      dayCount: [] as string[],
      monthCount: '0',
      types: [] as Types[],
    };
    const resolutionMonthData = [] as any;


    for (const date of this.dateGroup.currentDate) {

      const currentDay = JSON.parse(JSON.stringify(this.tallyRecord.filter((item) => {
        return item.date === date;
      })));
      // console.log(currentDay,'currentDay')
      resolutionMonthData.push(currentDay);
    }
    currentMonthData.record = resolutionMonthData;
    // console.log(currentMonthData.record,'record')

    for (const today of resolutionMonthData) {
      // console.log(today, '一个today');
      if (!(today instanceof Array)) {
        currentMonthData.dayCount.push(String(0));
      } else if (today instanceof Array) {
        let sameDayCount = 0;
        for (const todayItem of today) {
          sameDayCount = sameDayCount + Number(todayItem.amount);

        }
        // console.log(sameDayCount, 'sameday');
        currentMonthData.dayCount.push(toFloat(sameDayCount) as string);
      }
    }

    // 求月和
    for (const oneday of currentMonthData.dayCount) {
      const dayCount = Number(oneday);
      let monthCount = Number(currentMonthData.monthCount);
      monthCount = Number(formatTsNum(this.exactingFloat(monthCount + dayCount)));
      currentMonthData.monthCount = toFloat(monthCount) as string;
    }

    const flatMonthData = this.flatten(resolutionMonthData);
    //  扁平化每月的数据

    const typesId = {} as any;

    for (const item of flatMonthData) {
      const tagId = item.tagId.toString();
      if (Object.hasOwnProperty(item.tagId)) {
        return;
      }
      typesId[tagId] = item.tagId;
      //  通过哈希不能有重复的键名进行id去重
      // 此处为了获得每个类的图标id
    }


    for (const tagId of Object.keys(typesId)) {
      const monthCount = Number(currentMonthData.monthCount);
      const sameType = flatMonthData.filter((item: RecordItem) => {
        return item.tagId === typesId[tagId];
      });
      if (Array.isArray(sameType) && sameType.length > 0) {
        const typeCountArray = sameType.map((item) => {
          return Number(item.amount);
        });
        const typeCount = typeCountArray.reduce((count, item) => {
          return count + item;
        }, 0);
        const type = {
          typeCount: toFloat(typeCount) as string,
          typeIcon: sameType[0].iconName,
          typeName: sameType[0].name,
          typePercent: this.exactingFloat((typeCount / Number(monthCount) * 100)),
        };
        currentMonthData.types.push(type);
      }
    }
    currentMonthData.types = currentMonthData.types.sort((item1: Types, item2: Types) => {
      return Number(item2.typeCount) - Number(item1.typeCount);
    });

    this.dateGroup.currentData = {
      record: currentMonthData.record,
      unitCount: currentMonthData.dayCount,
      dateCount: currentMonthData.monthCount,
      types: currentMonthData.types,
    };
  }

  /*年*/
  public calcYearGroup() {
    const currentMonthDate = dayjs();
    const yearShow = [] as any;

    let todayToJanuary = 0;
    const currentYear = [];


    todayToJanuary = parseInt(currentMonthDate.format('MM'), 10) - 1;
    // 当前月到1月的差值


    // yearShow.push({date: currentMonth, name: '本周'});
    //
    //


    // 今年数据


    for (let i = todayToJanuary; i >= 0; i--) {
      // 每周从周一开始递增
      const month = currentMonthDate.subtract(i, 'month').format('YYYY-MM');
      currentYear.push(month);
    }
    yearShow.push({date: currentYear, name: '今年'});

    // 得到今年月份组
    this.dateGroup.dateShow = yearShow;
    this.dateGroup.currentDate = currentYear;
    this.activeName = String(this.dateGroup.dateShow.length - 1);

    /*阶段一*/


    interface Types {
      typeCount: string;
      typeIcon: string;
      typeName: string;
      typePercent: string;
    }

    const currentMonthData = {
      record: [] as RecordItem[],
      monthCount: [] as string[],
      yearCount: '0',
      types: [] as Types[],
    };
    const resolutionYearData = [] as any;


    for (const date of this.dateGroup.currentDate) {

      const currentDay = JSON.parse(JSON.stringify(this.tallyRecord.filter((item) => {
        return item.date.indexOf(date) > -1;
      })));


      resolutionYearData.push(currentDay);
    }
    currentMonthData.record = resolutionYearData;
    // console.log(currentMonthData.record,'record')

    for (const today of resolutionYearData) {
      // console.log(today, '一个today');
      if (!(today instanceof Array)) {
        currentMonthData.monthCount.push(String(0));
      } else if (today instanceof Array) {
        let sameDayCount = 0;
        for (const todayItem of today) {
          sameDayCount = sameDayCount + Number(todayItem.amount);

        }
        // console.log(sameDayCount, 'sameday');
        currentMonthData.monthCount.push(toFloat(sameDayCount) as string);
      }
    }

    // 求月和
    for (const oneday of currentMonthData.monthCount) {
      const dayCount = Number(oneday);
      let monthCount = Number(currentMonthData.yearCount);
      monthCount = Number(formatTsNum(this.exactingFloat(monthCount + dayCount)));
      currentMonthData.yearCount = toFloat(monthCount) as string;
    }

    const flatYearData = this.flatten(resolutionYearData);
    //  扁平化每周的数据


    const typesId = {} as any;

    for (const item of flatYearData) {
      const tagId = item.tagId.toString();
      if (Object.hasOwnProperty(item.tagId)) {
        return;
      }
      typesId[tagId] = item.tagId;
      //  通过哈希不能有重复的键名进行id去重
      // 此处为了获得每个类的图标id
    }


    for (const tagId of Object.keys(typesId)) {
      const yearCount = Number(currentMonthData.yearCount);
      const sameType = flatYearData.filter((item: RecordItem) => {
        return item.tagId === typesId[tagId];
      });
      if (Array.isArray(sameType) && sameType.length > 0) {
        const typeCountArray = sameType.map((item) => {
          return Number(item.amount);
        });
        const typeCount = typeCountArray.reduce((count, item) => {
          return count + item;
        }, 0);
        // 累加操作
        const type = {
          typeCount: toFloat(typeCount) as string,
          typeIcon: sameType[0].iconName,
          typeName: sameType[0].name,
          typePercent: this.exactingFloat((typeCount / Number(yearCount) * 100)),
        };
        currentMonthData.types.push(type);
      }
    }
    currentMonthData.types = currentMonthData.types.sort((item1: Types, item2: Types) => {
      return Number(item2.typeCount) - Number(item1.typeCount);
    });
    // 价格高到低排序

    this.dateGroup.currentData = {
      record: currentMonthData.record,
      unitCount: currentMonthData.monthCount,
      dateCount: currentMonthData.yearCount,
      types: currentMonthData.types,
    };


  }


  public dateClick(tab: any, event: any) {
    this.dateGroup.currentDate = this.dateGroup.dateShow[parseInt(this.activeName, 10)].date;
    if (this.dateSelected === 'week') {
      this.updateWeekGroup();
    } else if (this.dateSelected === 'month') {
      this.updateMonthGroup();
    } else if (this.dateSelected === 'year') {
      this.calcYearGroup();
    }
    this.initOption();
  }


  public scroll() {
    this.$nextTick(() => {
      const period = this.$refs.period as HTMLDivElement;
      period.scrollLeft = period.scrollWidth;
    });
  }

  public changeChartType() {
    if (this.chartType === 'lineChart') {
      this.chartType = 'pieChart';
    } else {
      this.chartType = 'lineChart';
    }
    this.initOption();
  }

  public changeDate(date: string) {
    this.dateSelected = date;
    // 修改周、月、年后加载的选项重置到最后
    if (this.dateSelected === 'week' && this.dateSelectedState !== this.dateSelected) {
      this.calcWeekGroup();
      this.dateSelectedState = 'week';
    } else if (this.dateSelected === 'month' && this.dateSelectedState !== this.dateSelected) {
      this.calcMonthGroup();
      this.dateSelectedState = 'month';
    } else if (this.dateSelected === 'year' && this.dateSelectedState !== this.dateSelected) {
      this.calcYearGroup();
      this.dateSelectedState = 'year';
    }
    this.$nextTick(() => {
      this.scroll();
    });
    this.initOption();


  }

  public fetchRecord() {
    const tallyRecord = this.$store.state.tallyRecord.filter((item: RecordItem) => {
      return item.type === this.tabType;
    });
    this.tallyRecord = tallyRecord;
  }

  public exactingFloat(value: number) {
    const precision = 20;

    let result = math.format(value, precision);

    if (result.indexOf('e')) {
      const toNumber = Number(result);
      result = toNumber.toLocaleString();

      return result;
    } else {

      return result;
    }
  }

  public flatten(arr: any) {
  // 数组扁平化处理
    return arr.reduce((result: any, item: any) => {

      return result.concat(Array.isArray(item) ? this.flatten(item) : item);
    }, []);
    // reduce接收的第一个参数是函数，第二个是数组积累操作的第一个值。
  }

  public calcColor(data: any[], colorScope: string[]) {
    const ColorScale = require('color-scales');
    const colorGroup = [];
    for (let i = 0; i < data.length; i++) {
      const colorScale = new ColorScale(0, data.length, colorScope, 1);
      const hexStr = colorScale.getColor(i).toHexString();
      colorGroup.push(hexStr);
    }
    return colorGroup;

  }

  public initOption() {

    let xAxis;
    let xValue;
    let count = '';
    const colorGroup = ['#e0cdcf', '#b5c4b1', '#9ca8b8', '#8696a7', '#939391', '#656565'];
    let types = [] as any;
    const pieData = [];

    if (this.dateSelected === 'year') {
      xAxis = this.dateGroup.currentDate.map((item) => {
        return parseInt(dayjs(item).format('MM'), 10) + '月';
      });
    } else {
      xAxis = this.dateGroup.currentDate.map((item) => {
        return dayjs(item).format('MM-DD');
      });
    }

    xValue = this.dateGroup.currentData.unitCount;
    count = this.dateGroup.currentData.dateCount;
    types = this.dateGroup.currentData.types;


    if (this.chartType === 'pieChart') {
      if (xValue.length <= 7) {
        this.chartSize = 'normal';
      } else if (xValue.length > 7 && xValue.length <= 12) {
        this.chartSize = 'big';
      } else if (xValue.length > 12) {
        this.chartSize = 'large';
      }

      this.chartOption = {
        grid: {
          top: 20,
          right: 0,
          bottom: 20,
          left: 0,
        },
        xAxis: {
          type: 'category',
          data: xAxis,
          show: true,
          axisLabel: {
            interval: 0,
            // X轴上显示标签的间隔，为0则全部显示
          },
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {lineStyle: {color: '#666'}},
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [{
          data: xValue,
          type: 'line',
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {borderwidth: 1, color: '#666'},
        }],
        tooltip: {
          show: true,
          triggerOn: 'click',
          position: 'top',
          confine: 'true',
          trigger: 'axis',
          // formatter:'{b}<br />{c}',
          formatter(params: any[]) {
            return `
              <div id="lineFormatter">
                  <p>${params[0].axisValue}</p>
                  <p>${params[0].data}</p>
              </div>
          `;

          },
        },
      };
    } else if (this.chartType === 'lineChart') {
      this.chartSize = 'normal';
      for (const item of types) {
        const itemGroup = {
          value: Number(item.typeCount),
          name: item.typeName,

        };
        pieData.push(itemGroup);
      }

      this.chartOption = {

        title: {
          text: '支出占比',
          left: '5%',
          top: '10%',
        },
        xAxis: {
          show: false,
        },
        tooltip: {
          show: false,
          trigger: 'item',
          triggerOn: 'click',
          confine: 'true',
          alwaysShowContent: 'true',
          position: 'inside',

        },
        legend: {
          type: 'scroll',
          top: '10%',
          right: '0%',
          orient: 'vertical',
          selectedMode: false,
          bottom: '0%',
        },


        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          minAngle: 5,
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#d5d5d5',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'center',
            formatter: [
              `{b|总支出}`, `{c|${count}}`,
            ].join('\n'),
            rich: {
              b: {
                color: '#333333',
                fontSize: 16,
                lineHeight: 30,
              },
              c: {
                color: '#666666',
                fontSize: 14,
                lineHeight: 20,
              },
            },
          },
          labelLine: {
            show: true,
          },
          color: this.calcColor(pieData, colorGroup),
          emphasis: {
            scale: true,
            scaleSize: 10,
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold',
              align: 'center',
              verticalAlign: 'middle',
              width: 100,
              overflow: 'truncate',
              ellipsis: '...',
              // backgroundColor:'#ffffff',
              formatter: [
                '{b|{b}}', '{c|{c}}',
              ].join('\n'),
              rich: {
                b: {
                  color: '#333333',
                  fontSize: 15,
                  lineHeight: 30,

                },
                c: {
                  color: '#666666',
                  fontSize: 24,
                  lineHeight: 30,

                },
              },
            },
          },
          data: pieData,
        }],
      };
    }

  }

}
</script>

<style lang='scss' scoped>
    .ChartWrapper {
        /*padding-bottom: 68px;*/

        > .title {
            position: relative;
            background: #ffffff;

            > .icon {
                width: 30px;
                height: 30px;
                position: absolute;
                right: 20px;
                top: 17px;
            }
        }

        > .dateWrapper {
            display: flex;
            justify-content: center;
            background: white;
            padding-bottom: 10px;

            > button {
                border: 2px solid black;
                font-size: 16px;
                font-weight: 600;
                width: 85px;
                height: 36px;
                text-align: center;
                background: #ffffff;
            }

            > button:nth-child(0n+1) {
                border-radius: 10px 0px 0px 10px;
            }

            > button:nth-child(0n+2) {
                border-left: 0px;
                border-right: 0px;
            }

            > button:nth-child(0n+3) {
                border-radius: 0px 10px 10px 0px;
            }

            .dateSelected {
                color: white;
                background: black;
            }
        }

        .periodWrapper {
            .period {
                overflow: hidden;
                overflow-x: auto;
                display: flex;
                justify-content: flex-start;
                padding: 0 20px;

                .tabs {
                    background: #eeeeee;
                }

                ::v-deep .el-tabs {
                    .el-tabs__item {
                        user-select: none;
                    }

                    .el-tabs__item.is-active {
                        color: black;

                    }

                    .el-tabs__active-bar {
                        background-color: black;
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

            .rankWrapper {
                h2 {
                    font-size: 16px;
                    text-align: left;
                    padding: 10px 20px;
                }

                .rank {
                    background: #ffffff;
                    height: calc(100vh - 482px);
                    overflow-y: auto;

                    li {
                        padding: 20px 20px;
                        display: flex;
                        justify-content: space-between;

                        > .icon {
                            background: #212121;
                            color: white;
                            width: 45px;
                            height: 45px;
                            padding: 5px;
                            border-radius: 50%;
                        }

                        .dataWrapper {
                            width: 83%;

                            > .data {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding-bottom: 10px;

                                > .dataLeft {
                                    > .name {
                                        font-size: 15px;
                                        font-weight: 600;
                                    }

                                    > .percent {
                                        font-size: 12px;
                                        font-weight: 600;
                                    }
                                }

                                > .typeCount {
                                    font-size: 20px;
                                }
                            }

                            ::v-deep .el-progress-bar {
                                > .el-progress-bar__outer {
                                    background-color: #dddddd;
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

                > .mask {
                    background: radial-gradient(ellipse at center, #7f7a7b 0%, #ebeef5 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
                    color: #5e5e5e;
                    font-size: 30px;
                    padding: 20px 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: calc(100vh - 482px);

                    > .icon {
                        width: 80px;
                        height: 80px;
                    }
                }
            }

        }
    }
</style>
