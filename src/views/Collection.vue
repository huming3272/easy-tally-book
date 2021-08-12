<template>
    <div class="collection" :style="h?{height:h+'px'}:''">
        <div class="title">
            <Icon class="icon" iconname="toBack" @click="toBack"></Icon>
            <Tabs :value.sync="record.type" :submit="flag"></Tabs>
        </div>
        <div class="contentWrapper"ref="tagWrapper">
            <Tags :text="true" use="collection" :data="iconDatas" :value.sync="record.tagId" :submit="flag" :scrollTag.sync="scrollTag"></Tags>
        </div>
        <NumberPad :submit.sync="flag" :syncNote.sync="record.note" :syncDate.sync="record.date"
                   :amount.sync="record.amount"
                   use="edit"
                   @submit="saveData"></NumberPad>

    </div>
</template>

<script lang="ts">
import Tags from '@/components/Collection/Tags.vue';
import NumberPad from '@/components/Collection/NumberPad.vue';

import recordId from '@/lib/recordId.ts';
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import {Message} from 'element-ui';

@Component({
  components: {Tags, NumberPad},
})
export default class Collection extends Vue {

  public iconDatas: CreatedTags[] = [];
  public flag = false;

  public record: RecordItem = {
    id: 0,
    type: 'pay',
    tagId: 0,
    note: '',
    date: '',
    amount: 0,
    search: '',
  };
  public h = 0;
  public scrollTag = 0;
  @Watch('scrollTag')
  public scroll() {
    const tagWrapper = this.$refs.tagWrapper as HTMLDivElement;
    if (tagWrapper) {
      // console.dir(tagWrapper)
      tagWrapper.scrollTop = this.scrollTag - tagWrapper.clientHeight + 10;
    }

  }


  public beforeMount() {
    this.$store.commit('fetchTags');
    this.iconDatas = this.$store.state.mergeIcon;
    this.initRecord();
  }

  public mounted() {
    this.h = document.body.clientHeight;
  }

  public initRecord() {
    const id = this.$route.query.id;
    if (id) {
      this.$store.commit('fetchRecord');
      const initRecord = this.$store.state.tallyRecord.filter((item: RecordItem) => {
        return item.id === Number(id);
      })[0];
      if (!initRecord) {
        return this.$message({
          message: '请确认id是否存在',
          type: 'warning',
          duration: 1000,
          offset: 150,
        });
      }
      this.record = JSON.parse(JSON.stringify(initRecord));

    }
  }

  public saveData(data: number) {
    this.record.amount = data;
    const currentTag = this.iconDatas.filter((item: CreatedTags) => {
      return item.id === this.record.tagId;
    })[0];
    this.record.search = `${this.record.note},${this.record.amount},${currentTag.name}`;
    if (this.$route.query.id) {
      this.$store.commit('updateRecord', this.record);

    } else {
      this.record.id = recordId();
      const recordData = JSON.parse(localStorage.getItem('tallyRecord') || '[]') as RecordItem[];
      recordData.push(this.record);
      localStorage.setItem('tallyRecord', JSON.stringify(recordData));
      this.flag = true;
      this.$message(
      {
        message: '记录添加成功',
          type: 'success',
        duration: 2000,
        offset: 150,
      },
      );
    }
  }

  public toBack() {
    if (this.$route.query.hasOwnProperty('id')) {
      this.$router.back();
    } else {
      this.$router.replace('/statistics');
    }

  }
}
</script>

<style lang='scss' scoped>
    .collection {
        height: 100vh;

        .title {
            box-shadow: 0 -4px 5px -5px rgba(0, 0, 0, 0.2) inset;
            position: relative;
            background: #fff;

            ::v-deep > .icon {
                width: 20px;
                height: 20px;
                color: black;
                position: absolute;
                top: 36%;
                left: 5%;
                cursor: pointer;
            }
        }

        .contentWrapper {
            height: calc(100vh - 370px);
            overflow-y: auto;
            background: #fff;

            ::v-deep > .tags {
                > ul {
                    > li {
                        flex: 0 25%;
                    }
                }
            }

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

</style>
