<template>
    <div class="layoutWrapper">
        <div class="layout">
            <slot></slot>
        </div>
        <Navbar class="navbar"></Navbar>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue'
    import {Component,Vue} from 'vue-property-decorator'
    @Component({
        components:{Navbar}
    })
    export default class Layout extends Vue {

    }
</script>

<style lang='scss' scoped>
    .layoutWrapper{
        height: 100vh;
        display:flex;
        flex-direction: column;
        justify-content: space-between;
        .layout{
            margin-bottom: 68px;
        }
        .navbar{
            width: 100%;
            position: fixed;
            bottom: 0;
        }
    }

    @media screen and (min-width: 500px){
        .layoutWrapper{
            .navbar{
                max-width: 500px;
            }
        }
    }
</style>
