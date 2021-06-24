<template>
    <div class="createTag">
        <div class="title">
            <Icon class="icon" iconname="toBack" @click="toBack"></Icon>
            <span >{{title}}</span>
            <button @click="save()">确定</button>
        </div>
        <div class="inputWrapper">
            <div class="layout">
                <div class="iconWrapper">
                    <Icon class="icon" :iconname="newTags.src"></Icon>
                </div>
            </div>
            <input v-model="newTags.name" type="text" maxlength=10 ref="input" placeholder="请输入标签名">
            <span @click="clearName">清除</span>
        </div>
        <Tags :text="false" :data="iconDatas" :tagSrc.sync="newTags.src" :currentTagSrc="newTags.src"></Tags>
    </div>
</template>

<script lang="ts">
import Tags from '@/components/Collection/Tags.vue';
import iconDatas from '@/constant/iconDatas.ts';
import tagId from '@/lib/tagId.ts';
import { Message } from 'element-ui';
import {Component, Vue} from 'vue-property-decorator';

@Component({
  components: {Tags},
})
export default class CreateTag extends Vue {
  public iconDatas = iconDatas;
  public title = '';
  public id = 0 || parseInt(this.$route.query.id as string, 10);
  public selfTagsList: CreatedTags[] = [];
  public newTags: CreatedTags = {
    name: '',
    src: '',
    id: 0,
    type: 'creation',
  };

  public toBack() {
    this.$router.replace('/information');
  }
  public clearName() {
    this.newTags.name = '';
  }
  public save() {
    if (this.newTags.name) {
      if (this.newTags.name.length > 10) {
        return this.$message({
          message: '标签字数超过10字',
          type: 'warning',
          duration: 1000,
        });
      }
      if (this.id) {
        // 有id说明要修改标签属性
        this.newTags.id = this.id;
        const currentTag = this.selfTagsList.filter((item) => {
              return item.id === this.id;
        })[0];
        const currentIndex = this.selfTagsList.indexOf(currentTag);
        this.selfTagsList[currentIndex] = this.newTags;

        // selfTagsList.push(this.newTags)
        localStorage.setItem('selfTagsList', JSON.stringify(this.selfTagsList));
        this.$message({
          message: '标签修改成功',
          type: 'success',
          duration: 2000,
          offset: 150,
        });
        return;
      }
      this.newTags.id = tagId();
      this.selfTagsList.push(this.newTags);
      localStorage.setItem('selfTagsList', JSON.stringify(this.selfTagsList));
      this.$message({
          message: '标签添加成功',
          type: 'success',
          duration: 2000,
          offset: 150,
        });
    } else {
      this.$message({
        message: '请填写标签名',
        type: 'warning',
        duration: 1000,
      });
    }
  }
  public getSelfTags(id: number) {

    if (!this.selfTagsList) {
      return;
    }
    const currentTag = this.selfTagsList.filter((item: CreatedTags) => {
          return item.id === this.id;
    })[0];
    this.newTags = currentTag;
    // this.newTags.src = 'dailyUse'
    console.log(this.newTags.src);
    console.log('newtag', this.newTags);
  }

  public beforeMount() {
    const selfTagsList = JSON.parse(localStorage.getItem('selfTagsList') || '[]');
    this.selfTagsList = selfTagsList;
    if (this.id) {
      this.title = '修改标签';
      this.getSelfTags(this.id);
    } else {
      this.title = '新建标签';
    }
  }
}
</script>

<style lang='scss' scoped>

    .createTag {
        background: #eeeeee;
        height:100vh;

        .title {
            /*box-shadow: 0 -4px 5px -5px rgba(0, 0, 0, 0.2) inset;*/
            display: flex;
            justify-content: space-between;
            align-items: center;

            position: relative;
            background: #fff;
            padding: 20px 5% 20px 5%;

            ::v-deep > .icon {
                width: 20px;
                height: 20px;
                color: black;
                /*    position:absolute;*/
                /*    top: 36%;*/
                /*    left: 5%;*/
                cursor: pointer;
            }

            > span {
                font-size: 20px;
                flex-grow: 1;
            }

            > button {

                border: none;
                background: transparent;
                font-size: 16px;
                background: #333;
                color: white;
                border-radius: 20px;
                padding: 5px 10px;
                cursor: pointer;
            }

        }


        .inputWrapper {
            margin-top: 15px;
            display: flex;
            background: white;
            padding: 10px 5% 10px 5%;
            box-shadow: 0 -4px 5px -5px rgba(0, 0, 0, 0.2) inset;
            position: relative;


            .layout {
                flex: 0 50%;

                .iconWrapper {
                    width: 43px;
                    height: 43px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    background: #212121;

                    > .icon {
                        width: 22px;
                        height: 22px;
                        color: #dbdbdb;
                    }

                }
            }

            > input {
                flex: 0 50%;
                width: 100%;
                heigth: 25px;
                font-size: 18px;
                border: none;
                text-align: right;
            }
            > span{
                font-size: 12px;
                position:absolute;
                right: 150px;
                top: 22px;
                color: white;
                background: #333333;
                border-radius: 5px;
                padding: 2px 4px;
            }

        }

        ::v-deep > .tags {
            padding-top: 20px;
            background: white;
            height: calc(100vh - 150px);
            > ul {
                > li {
                    flex: 0 20%;
                }
            }
        }
    }

</style>
