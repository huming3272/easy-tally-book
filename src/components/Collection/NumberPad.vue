<template>
    <div class="numberPad" >
        <div class="output">
            <table>
                <td>
                    <div class="note">
                        <label>备注:</label>
                        <input type="text" maxlength=9 v-model="note" >
                    </div>
                </td>
                <td>
                    <div class="money">
                        <label>金额:</label>
                        <span>{{output}}</span>
                    </div>
                </td>
            </table>

        </div>
        <div class="buttons" @click="control">
            <table>
                <tr>
                    <td>
                        <button :class="{currentBtn:currentButton==='1'}">1</button>
                    </td>
                    <td>
                        <button :class="{currentBtn:currentButton==='2'}">2</button>
                    </td>
                    <td>
                        <button :class="{currentBtn:currentButton==='3'}">3</button>
                    </td>
                    <td>
<!--                        <button :class="{currentBtn:currentButton==='日期'}" >日期</button>-->
                        <el-date-picker
                                v-model="eDate"
                                type="date"
                                placeholder='选择日期'
                                ref="datePicker"
                               @focus="clearDate()"
                        >

                        </el-date-picker>

                    </td>
                </tr>
                <tr>
                    <td>
                        <button :class="{currentBtn:currentButton==='4'}">4</button>

                    </td>
                    <td>
                        <button :class="{currentBtn:currentButton==='5'}">5</button>

                    </td>
                    <td>
                        <button :class="{currentBtn:currentButton==='6'}">6</button>

                    </td>
                    <td>
                        <button :class="{currentBtn:currentButton==='删除'}">删除</button>

                    </td>
                </tr>
                <tr>
                    <td>
                        <button :class="{currentBtn:currentButton==='7'}">7</button>

                    </td>
                    <td>
                        <button :class="{currentBtn:currentButton==='8'}">8</button>

                    </td>
                    <td>
                        <button :class="{currentBtn:currentButton==='9'}">9</button>

                    </td>
                    <td>
                        <button :class="{currentBtn:currentButton==='清空'}">清空</button>
                    </td>
                </tr>
                <tr>
                    <td colspan=2>
                        <button :class="{currentBtn:currentButton==='0'}" class="zero">0</button>
                    </td>
                    <td>
                        <button :class="{currentBtn:currentButton==='.'}">.</button>
                    </td>
                    <td>
                        <button :class="{currentBtn:currentButton==='OK'}" class="ok">OK</button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import {Message} from 'element-ui';
import dayjs from 'dayjs';

import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
@Component
export default class NumberPad extends Vue {
  @Prop() public readonly amount!: number;
  // !为空不警告
  @Prop(Boolean) public submit!: boolean;
  // output = this.value.toString();
  public output = '0';
  public currentButton = '';
  public eDate =  dayjs().format('YYYY-MM-DD');
  public date = '';
  public note = '';
  @Watch('eDate')
  public editDate() {
    if (this.eDate) {
      this.date = dayjs(this.eDate).format('YYYY-MM-DD');
    }
  }
  @Watch('submit')
  public init() {
    this.clear();
    this.$emit('update:submit', false);

  }

  public mounted() {
      this.editDate();
  }

  get parse() {
    return parseFloat(this.output);
  }

  public clearDate() {
    this.eDate = '';
  }


  public control(event: MouseEvent) {
    const button = (event.target as HTMLButtonElement);
    const input = button.innerText!;
    // 忽略类型，防止提示
    if (input === '删除') {
      this.remove();
    } else if (input === '清空') {
      this.clear();
    } else if (input === 'OK') {
      this.ok();
    }
    this.numInput(input);
    this.selectButton(input);
  }

  public numInput(inputButton: string) {
    if (this.output.indexOf('.') >= 0 && inputButton === '.') {
      return;
    }
    if (this.output.length >= 16) {
      return;
    }
    if ('0123456789.'.indexOf(inputButton) >= 0) {
      if (this.output === '0' && inputButton !== '.') {
        this.output = inputButton;
        return;
      }
      this.output += inputButton;
      return;
    }
  }

  public remove() {
    if (this.output.length === 1) {
      this.output = '0';
      return;
    }
    this.output = this.output.slice(0, -1);
  }

  public clear() {
    this.output = '0';
    this.note = '';
    this.eDate =  dayjs().format('YYYY-MM-DD');
    this.date = this.eDate;
  }

  public ok() {
    // this.$emit('update:amount', this.parse);
    if (this.note.length > 9 ) {
      return this.$message({
        message: '字数超过9个',
        type: 'warning',
        duration: 1000,
        offset: 200,
      });
    }
    if (!this.eDate) {
      return this.$message({
        message: '请填写日期',
        type: 'warning',
        duration: 1000,
        offset: 200,
      });

    }
    this.$emit('update:note', this.note);
    this.$emit('update:date', this.date);

    this.$emit('submit', this.parse);
    this.clear();

  }

  public selectButton(button: string) {
    this.currentButton = button;
    setTimeout(() => {
      this.currentButton = '';
    }, 200);
  }

}
</script>

<style lang="scss" scoped>
    @import "../../assets/style/helper.scss";

    ::v-deep .el-input{
        .el-input__inner{
            padding: 0;
            text-align: center;
        }
        width: 100% !important;
        .el-input__inner{
            border:none;
            background: transparent;
            height: 64px;
            /*color:transparent;*/
            cursor:pointer;
        }
        .el-input__icon{
         &::before{
             content:''
         }
        }
    }
    .numberPad {
        background:#fcfcfc;
        .output {
            @extend %clearFix;
            font-size: 20px;
            font-family: Consolas, monospace;
            text-align: left;
            /*display: flex;*/
            /*justify-content: space-between;*/
            >table {
                width: 100%;
                border-spacing: 0;
                border-collapse: collapse;
                label {
                    font-size: 14px;
                    font-weight: 600;
                }
                td {
                    border: 1px solid #e3e3e3;
                    border-bottom: 0px;
                    width: 50%;
                    overflow: hidden;
                    padding:5px 0 5px 10px;
                    .note{
                        display: flex;
                        align-items: center;
                        padding-right: 5px;

                        input{
                            width: 65%;
                            max-width: 100%;
                            border-width: 0;
                            background: transparent;
                            font-size: 14px;
                        }
                        /*border:1px solid red;*/
                    }
                    .money{
                        flex: 0 50%;
                        display: flex;
                        align-items: center;
                        bottom: 2px;
                        /*border:1px solid red;*/
                        label{
                            padding-right: 2px;
                        }
                    }
                }
            }



        }

        .currentBtn {
            background: radial-gradient(ellipse at center,
                    rgba(0, 0, 0, 0.2) 1%,
                    rgba(119, 119, 119, 0.99) 100%,
                    rgba(119, 119, 119, 1) 101%) !important;
            /*filter: drop-shadow(0px 0px -1px rgba(0,0,0,1)) !important;*/
        }

        .buttons {
            @extend %clearFix;
            table{
                    width:100%;
                    border-spacing: 0;
                    border-collapse: collapse;
                td {
                    border: 1px solid #e3e3e3;
                    width: 25%;
                    padding: 1px;
                }
                button {
                    width: 100%;
                    height: 64px;
                    float: left;
                    background: none;
                    border:none;
                    transition: all 0.2s;
                    margin: 0 -1px -1px 0px;
                    &.ok {
                        height: 64px;
                        float: right;
                        background: #333333;
                        color: #ffffff;
                    }



                    $bg: #f2f2f2;

                    /*<!--&:nth-child(1), {-->*/
                    /*<!--    background: $bg;-->*/
                    /*<!--}-->*/

                    /*<!--&:nth-child(2), &:nth-child(5) {-->*/
                    /*<!--    background: darken($bg, 4%);-->*/
                    /*<!--}-->*/

                    /*<!--&:nth-child(3), &:nth-child(6), &:nth-child(9) {-->*/
                    /*<!--    background: darken($bg, 4*2%);-->*/

                    /*<!--}-->*/

                    /*<!--&:nth-child(4), &:nth-child(7), &:nth-child(10) {-->*/
                    /*<!--    background: darken($bg, 4*3%);-->*/

                    /*<!--}-->*/

                    /*<!--&:nth-child(8), &:nth-child(11), &:nth-child(14), {-->*/
                    /*<!--    background: darken($bg, 4*5%);-->*/

                    /*<!--}-->*/

                    /*<!--&:nth-child(12), &:nth-child(15) {-->*/
                    /*<!--    background: darken($bg, 4*6%);-->*/

                    /*<!--}-->*/

                    /*<!--&:nth-child(13) {-->*/
                    /*<!--    background: darken($bg, 4*7%);-->*/
                    /*<!--    !*ok*!-->*/
                    /*<!--}-->*/
                }
            }

        }
    }
</style>
