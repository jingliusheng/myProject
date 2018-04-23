<template>
    <div class="help">
        <div class="title" v-if="dataList.length">常见问题</div>
        <group :gutter="0" style="padding-bottom: 66px" v-if="dataList.length">
            <cell is-link :link="'/help/detail/'+item.id" v-for="item in dataList" :key="item.id">
                <span slot="title" style="font-size: 14px;color: #666666;">{{item.title}}</span>
            </cell>
        </group>
        <img src="./black.png" alt="" class="black-page" v-if="!dataList.length">
        <div class="hotline"><img src="./phone.png"><a href="tel:18989458256">客服热线：18989458256</a></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Group, Cell} from 'vux';
    export default{
        name: 'help',
        data(){
            return {
                dataList: []
            };
        },
        components: {
            Group,
            Cell
        },
        created(){
            this.$http.get(this.GLOBAL.BASEURL + '/help/index').then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.dataList = response.content;
                }
            }, response => {
                window.alert('网络原因，请稍后重试');
            })
        }
    }
</script>

<style lang="less" scoped>
    .weui-cell:before {
        left: 0;
    }

    .title {
        height: 34px;
        line-height: 34px;
        text-indent: 15px;
        color: #AAAAAA;
        font-size: 14px;
    }
    .black-page{
        width:100vw;
        height:100vh;
        vertical-align: middle;
    }
    .hotline {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 64px;
        text-align: center;
        line-height: 64px;
        color: #666666;
        font-size: 14px;
        background-color: #FFFFFF;
        img {
            vertical-align: middle;
            width: 19px;
            height: 19px;
            margin-right: 16px;
        }
    }

</style>
