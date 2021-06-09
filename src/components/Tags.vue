<template>
    <div class="tagsWrapper">
        <div class="tags">
            <span :class="{'active':state==='pay'}" @click="select('pay')">支出</span>
            <span :class="{'active':state==='earn'}" @click="select('earn')">收入</span>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'

    @Component
    export default class Tags extends Vue {
        state= 'pay'
        select(state){
            this.state = state
        }
    }
</script>

<style lang='scss' scoped>
    .tagsWrapper{
        padding: 10px 0 15px 0;
        >.tags{
            width: 33%;
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
