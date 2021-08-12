<template>
    <div class="tags">
        <ul @click="triggerTags">
            <li v-for="item in iconDatas" ref="tag" :key="item.id" :data-icon-id="item.id" :data-icon-src="item.src" :data-icon-name="item.name">
                <div class="iconWrapper" :class="{'selected': selectedTag(item.id,item.src)}">
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
  @Prop() public data!: CreatedTags[];
  @Prop() public text!: boolean;
  @Prop() public currentTagSrc?: string;
  @Prop() public use?: string;
  @Prop() public scrollTag?: string;
  @Prop() public value?: string;

  public iconDatas = this.data;
  public selected = -1;
  public tagSrc = '';
  public tagName = '';

  @Watch('submit')
  public initTag() {
    if (this.currentTagSrc) {
      // 使用
      this.tagSrc = this.currentTagSrc;
    } else {
      this.tagSrc = this.data[0].src;
      this.selected = this.data[0].id;
      this.tagName = this.data[0].name;
      this.forEmit();
    }
  }
  public beforeMount() {
        if (this.$route.query.id) {
          this.selected = Number(this.value);
        } else {
          this.initTag();
        }
  }

  public mounted() {
    if (this.use === 'createTags') {
      this.srcollCurrentTag();
    }

  }

  public srcollCurrentTag() {
    // console.log(this.$refs.tag,'tag')
    const tags = this.$refs.tag || [] as any;
    const currentTag =  tags.filter((item: any) => {
        return parseInt(item.dataset.iconId, 10) === this.selected;
    })[0];
    if (currentTag) {
      // 如果存在时
      this.$emit('update:scrollTag', currentTag.offsetTop);
    }


    // offsetTop
    // dataset.iconId
  }
  public forEmit() {
    this.$emit('update:tagName', this.tagName);
    this.$emit('update:value', this.selected);
    this.$emit('update:currentTagSrc', this.tagSrc);
  }

  public selectedTag(id: number, src: string) {
    // console.log(id,'图标id',src)
    if (this.use === 'collection') {
        if (id === this.selected) {
          return true;
        }
    } else {
      if (src === this.tagSrc) {
        return true;
      }
    }

  }




  public triggerTags(event: any) {
    const li = event.path.filter((item: { nodeName: string; }) => {
          return item.nodeName === 'LI';
        });
    if (li.length !== 0) {
        this.selected = parseInt(li[0].dataset.iconId, 10);
        this.tagSrc = li[0].dataset.iconSrc;
        this.tagName = li[0].dataset.iconName;

        this.forEmit();

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
                overflow:hidden;
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
                    user-select: none;
                    width: 100%;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
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
