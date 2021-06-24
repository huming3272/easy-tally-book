<template>
    <div class="tabsWrapper">
        <div class="tabs">
            <span :class="{'active':state==='pay'}" @click="select('pay')">支出</span>
            <span :class="{'active':state==='earn'}" @click="select('earn')">收入</span>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';

@Component
export default class Tabs extends Vue {
    @Prop(String) public value!: string;
    @Prop() public submit!: boolean;
    public state = 'pay';
    @Watch('submit')
    public init() {
        if (this.submit) {
          this.state = 'pay';
        }

    }
    public select(state: string) {
        this.state = state;
        this.$emit('update:value', this.state);
    }
}
</script>

<style lang='scss' scoped>
    .tabsWrapper{
        padding: 10px 0 15px 0;
        >.tabs{
            width: 160px;
            margin: 0 auto;
            display:flex;
            justify-content: space-between;
            >span{
                font-size: 19px;
                position: relative;
                user-select: none;
                cursor:pointer;
                padding: 10px 20px 10px 20px ;
                /*border: 1px solid;*/
                &.active::after{
                    content: '';
                    display:block;
                    width: 100%;
                    height: 2px;
                    background: #000;
                    position: absolute;
                    right: 0%;
                    bottom: 0px;


                }
            }

        }
    }
</style>
