<template>
    <div class="showEchart" ref="showEchart">
        <div class="wrapper" :class="{
        normal:chartSize ==='normal',
        big:chartSize ==='big',
        large:chartSize === 'large'
    }" ref="wrapper"></div>
    </div>
</template>

<script lang="ts">
import { EChartsOption, ECharts } from 'echarts';
import * as echarts from 'echarts';
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';

@Component
export default class Echarts extends Vue {
    @Prop() public options?: EChartsOption;
    @Prop() public chartSize?: string;
    public chart?: ECharts;
    public chartWrapper = {}as HTMLElement;
    public cOption = {};


    @Watch('options')
    public onOptionsChange(newValue: EChartsOption) {
      this.scroll();
      const options = newValue;
      this.cOption = newValue;
      if (!options) {
          return console.error('options 为空');
        } else {
          if (this.chart) {
            this.chart.clear();
            // 清除echart案例，防止上一个案例提示残留
            this.$nextTick(() => {
              this.chart!.resize();
            });
            this.chart!.setOption(options, false);
          }


        }

    }
    public mounted() {
        // 给个声明类型 作为 html的div元素类型
        this.chart = echarts.init(this.$refs.wrapper as HTMLDivElement);
        if (this.options) {
            this.onOptionsChange(this.options);
        }
        this.scroll();
        this.chartAct();



    }
    public scroll() {
        this.$nextTick(() => {
          const showEchart = this.$refs.showEchart as HTMLDivElement;
          showEchart.scrollLeft = showEchart.scrollWidth;
        });
    }
  public chartAct() {
    let renderSwitch = true;
    // @ts-ignore

    this.chart!.on('mouseover', (params) => {

      // @ts-ignore
      if (this.cOption.series[0].type === 'pie') {

        renderSwitch = true;
        //

        // @ts-ignore
        this.cOption.series[0].label.show = false;
        // @ts-ignore
        this.cOption.series[0].animation = false;
        this.chart!.setOption(this.cOption!, false);


      }


    });
    this.chart!.on('mouseout', (params) => {
      renderSwitch = false;
    });
    this.$nextTick(() => {
      // this.chartWrapper = document.querySelector('.wrapper canvas') as HTMLCanvasElement
      this.chartWrapper = this.chart?.getDom() as HTMLDivElement;
      this.chartWrapper.addEventListener('mousemove', () => {
        // @ts-ignore
        if (!renderSwitch && this.cOption.series[0].type === 'pie') {

          // @ts-ignore
          this.cOption.series[0].label.show = true;
          // @ts-ignore
          this.cOption.series[0].animation = false;
          this.chart!.setOption(this.cOption!, false);
          // console.log('chartWrapper')
          renderSwitch = true;

        }

      });
    });

  }

}
</script>

<style lang='scss' scoped>
    .showEchart{
        width: 100%;
        overflow-x: auto;
        background: white;
        .wrapper{
            height: 200px;
        }
        .normal{
            width: 100%;
        }
        .big{
            width: 200%;
        }
        .large{
            width: 400%;
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
