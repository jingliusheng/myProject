<template>
    <div class="videoWrapper">
        <div class="prism-player" id="J_prismPlayer" v-if="videoplayer"></div>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                lessonMsg: {},
                player: {},
                videoplayer: true,
                timer: null,
                currentTime: 0,
                seek: false
            }
        },
        beforeCreate(){
            //      引入阿里的视频播放cdn节点上的js
            let videoSr = document.createElement('script');
            videoSr.src = '//g.alicdn.com/de/prismplayer/1.9.5/prism-h5-min.js';
            document.body.appendChild(videoSr);
        },
        methods: {
            getTime(){
                this.currentTime = Math.round(this.player.getCurrentTime());
                this.timer = setTimeout(this.getTime, 1000);
            },
            clear(){
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
            },
            getauthority(obj){
                console.log(obj);
                if (this.player) {
                    this.player.pause;
                }
                this.videoplayer = false;
                this.$http.post(this.GLOBAL.BASEURL + '/course/video_play_auth', {'lessonid': obj.id}).then((response) => {
                    response = response.body;
                    if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                        this.lessonMsg = response.content;
                        this.videoplayer = true;
                        this.$nextTick(() => {
                            this.player = new prismplayer({
                                id: 'J_prismPlayer',
                                width: '100%',
                                height: '210px',
                                autoplay: false,
                                playsinline: true,
//        播放方式二:推荐
                                vid: this.lessonMsg.videoid,
                                playauth: this.lessonMsg.playauth,
                                showBarTime: 3000000
                            });
                            this.getTime();
                            let _this = this;
                            _this.player.on('pause', function () {
                                _this.$emit('getPlayTime', _this.currentTime, obj.id);
                                _this.$http.post(_this.GLOBAL.BASEURL + '/course/learn_record', {
                                    'lessonid': obj.id,
                                    'playtime': _this.currentTime
                                }).then((response) => {
                                    response = response.body;
                                })
                            });
                            _this.player.on('ended', function () {
                                _this.$emit('getPlayTime', _this.currentTime, obj.id);
                                _this.$http.post(_this.GLOBAL.BASEURL + '/course/learn_record', {
                                    'lessonid': obj.id,
                                    'playtime': _this.currentTime
                                }).then((response) => {
                                    response = response.body;
                                })
                            });
                            _this.player.on('error', function () {
                                _this.$emit('getPlayTime', _this.currentTime, obj.id);
                                _this.$http.post(_this.GLOBAL.BASEURL + '/course/learn_record', {
                                    'lessonid': obj.id,
                                    'playtime': _this.currentTime
                                }).then((response) => {
                                    response = response.body;
                                })
                            });
                            if(obj.duration-obj.playtime>5){
                                _this.player.on('canplaythrough', function () {
                                    if (!_this.seeked) {
                                        _this.seeked = true;
                                        _this.player.seek(obj.playtime);
                                    }
                                });
                            }
                        })
                    } else if (response.status === this.GLOBAL.STATUSOBJ.noLogin) {
                        this.$router.push({path: '/login'});
                    } else if (response.status === this.GLOBAL.STATUSOBJ.noPhone) {
                        this.$router.push({path: '/bindphone/null'});
                    } else if (response.status === this.GLOBAL.STATUSOBJ.noMoney) {
                        window.alert(response.msg);
                    } else if (response.status === this.GLOBAL.STATUSOBJ.error) {
                        window.alert(response.msg);
                    } else if (response.status === 401) {
                        window.alert(response.msg);
                    } else if (response.status === 302) {
                        let str = response.content.url;
                        let routePath = this.$route.path.substring(1).split('/').join('_');
                        let str1 = str.replace(/123/, routePath);
                        window.location.href = str1;
                    }
                }, () => {
                    window.alert('网络原因，请稍后重试');
                });
            }
        }
    };
</script>

<style>
    @import '//g.alicdn.com/de/prismplayer/1.9.5/skins/default/index-min.css';

    .prism-player .prism-big-play-btn {
        top: 32px;
        right: 32px;
        margin: auto;
    }

    .videoWrapper {
        width: 100%;
        height: 210px;
        background: url("player.png") no-repeat top left;
        background-size: 100% 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 502;
    }
</style>
