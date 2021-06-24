<template>
    <div class="collection" :style="h?{height:h+'px'}:''">
        <div class="title">
            <Icon class="icon" iconname="toBack" @click="toBack"></Icon>
            <Tabs :value.sync="record.type" :submit="flag"></Tabs>
        </div>
        <div class="contentWrapper">
            <Tags :text="true" :data="iconDatas"  :tagSrc.sync="record.tag" :submit="flag"></Tags>
        </div>
        <NumberPad :iconDatas="iconDatas" :submit.sync="flag" :note.sync="record.note" :date.sync="record.date" :amount.sync="record.amount" @submit="saveData"></NumberPad>
    </div>
</template>

<script lang="ts">
import Tags from '@/components/Collection/Tags.vue';
import NumberPad from '@/components/Collection/NumberPad.vue';
import iconDatas from '@/constant/iconDatas.ts';
import recordId from '@/lib/recordId.ts';
import {Component, Vue} from 'vue-property-decorator';
@Component({
    components: {Tags, NumberPad},
})
export default class Collection extends Vue {
  public iconDatas = iconDatas;
  public flag = false;
  public record: RecordItem = {
    id: 0,
    type: 'pay',
    tag: '',
    note: '',
    date: '',
    amount: 0,
  };
  public h = 0;
  public mounted() {
    this.h = document.body.clientHeight;
  }
   public saveData(data: number) {
    this.record.amount = data;
    this.record.id = recordId();
    const recordData = JSON.parse(localStorage.getItem('message') || '[]' )as RecordItem[];
    recordData.push(this.record);
    localStorage.setItem('message', JSON.stringify(recordData));
    this.flag = true;
   }
  public toBack() {
    this.$router.replace('/statistics');
  }
}
</script>

<style lang='scss' scoped>
    .collection{
        height: 100vh;

        .title{
            box-shadow: 0 -4px 5px -5px rgba(0, 0, 0, 0.2) inset;
            position: relative;
            background: #fff;
            ::v-deep >.icon{
                width: 20px;
                height: 20px;
                color: black;
                position:absolute;
                top: 36%;
                left: 5%;
                cursor: pointer;
            }
        }
        .contentWrapper {
            height: calc(100vh - 370px);
            overflow-y: auto;
            background: #fff;
            ::v-deep >.tags {
                > ul {
                    > li {
                        flex: 0 25%;
                    }
                }
            }

            &::-webkit-scrollbar {
                /*滚动条整体样式*/
                width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
                height: 1px;
            }
            &::-webkit-scrollbar-thumb {
                /*滚动条里面小方块*/
                border-radius: 10px;
                box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                background   : #535353;
            }
            &::-webkit-scrollbar-track {
                /*滚动条里面轨道*/
                box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                background   : #ededed;
            }
        }

    }

</style>
