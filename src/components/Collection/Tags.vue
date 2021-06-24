<template>
    <div class="tags">
        <ul @click="triggerTags">
            <li v-for="item in iconDatas" :key="item.id" :data-icon-id="item.id" :data-icon-src="item.src">
                <div class="iconWrapper" :class="{'selected':item.src === tagSrc}">
                    <Icon class="icon"  :iconname="item.src"></Icon>
                </div>
                <p v-if="text">{{item.name}}</p>
            </li>

        </ul>
    </div>
</template>

<script lang='ts'>
import iconDatas from '@/constant/iconDatas.ts';
import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

@Component
export default class Tags extends Vue {
  @Prop(Boolean) public submit?: boolean;
  @Prop() public data!: IconGroup[];
  @Prop() public text!: boolean;
  @Prop() public currentTagSrc?: string;
  public iconDatas = this.data;
  // selected = -1
  public tagSrc = '';

  @Watch('submit')
  public mounted() {
      this.initTag();
  }
  public initTag() {
    if (this.currentTagSrc) {
      this.tagSrc = this.currentTagSrc;
    } else {
      this.tagSrc = this.data[0].src;
      // this.selected = this.data[0].id
      this.$emit('update:tagSrc', this.tagSrc);
    }
  }

  public triggerTags(event: any) {
    const li = event.path.filter((item: { nodeName: string; }) => {
          return item.nodeName === 'LI';
        });
    if (li.length !== 0) {
        // this.selected = parseInt(li[0].dataset.iconId)
        this.tagSrc = li[0].dataset.iconSrc;
        // this.$emit('update:value',this.selected)
        this.$emit('update:tagSrc', this.tagSrc);

    }

  }

}
</script>

<style lang='scss' scoped>
    .selected{
        background: #212121 !important;
        color: #fafafa !important;
    }
    .tags {
        > ul {
            padding-top: 20px;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;

            > li {
                /*flex: 0 25%;*/
                display: flex;
                flex-direction: column;
                align-items: center;
                /*border: 1px solid red;*/
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 20px;
                user-select: none;
                cursor: pointer;
                > p {
                    margin-top: 5px;
                }

                > .iconWrapper {
                    width: 48px;
                    height: 48px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    background: #dddddd;

                    > .icon {
                        width: 25px;
                        height: 25px;

                    }

                }

            }
        }
    }

</style>
