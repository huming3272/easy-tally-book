<template>
    <div class="collection">
        <Icon class="icon" iconname="toBack"></Icon>
        <Tags></Tags>
    </div>
</template>

<script>
    import iconDatas from '@/constant/iconDatas.ts'
    import {Component,Vue} from 'vue-property-decorator'
    @Component
    export default class Collection extends Vue {
        mounted() {
            console.log('iconDatas',iconDatas)
        }
    }
</script>

<style lang='scss' scoped>
    .collection{
        position: relative;
        ::v-deep .icon{
            width: 20px;
            height: 20px;
            color: black;
            position:absolute;
            top: 36%;
            left: 5%;

        }
    }
</style>
