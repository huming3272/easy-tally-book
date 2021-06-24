<template>
    <div class="navbarWrapper">
        <router-link to="/statistics" class="iconWrapper">
            <Icon class="icon" iconname="statistics"></Icon>
            <span>账单</span>
        </router-link>
        <router-link to="/chart" class="iconWrapper">
            <Icon class="icon" iconname="chart"></Icon>
            <span>图表</span>
        </router-link>
        <router-link to="/information" class="iconWrapper">
            <Icon class="icon" iconname="info"></Icon>
            <span>编辑</span>
        </router-link>
    </div>
</template>

<script>
    import {Component,Vue} from 'vue-property-decorator'

    @Component
    export default class Navbar extends Vue {

    }
</script>

<style lang='scss' scoped>
    .navbarWrapper{
        box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2) inset;
        display:flex;
        background: #ffffff;
        padding: 10px 0 10px 0 ;
        .router-link-active{
            >.icon{
                background: #000000;
                color:#ffffff;
                border-radius:5px;
            }
            >span{
                color: #000000 !important;
            }
        }
        .iconWrapper {
            width: calc(100%/3);
            height: 48px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            >span{
                color:#9d9d9d;
            }

            > .icon {
                width: 25px;
                height: 25px;

            }

        }
    }

</style>
