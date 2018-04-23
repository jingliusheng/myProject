import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/components/Home/main';
import List from '@/components/List/list';
import CourseDetail from '@/components/CourseDetail/coursedetail';
import CoursePoster from '@/components/CourseDetail/coursePoster';
import Ratings from '@/components/Ratings/ratings';
import NewCourse from '@/components/NewCourse/newCourse';
import FreeCourse from '@/components/FreeCourse/freeCourse';
import Offline from '@/components/Offline/offline';
import FeedBack from '@/components/Offline/feedback';
import OfflineDetail from '@/components/Offline/offlineDetail';
import User from '@/components/User/user';
import CollectedList from '@/components/User/collectedList';
import Account from '@/components/User/account';
import Invite from '@/components/User/invite';
import Help from '@/components/User/help';
import HelpDetail from '@/components/User/helpDetail';
import MyCourse from '@/components/User/myCourse';
import Member from '@/components/User/member';
import Mall from '@/components/Integral/mall';
import MallDetail from '@/components/Integral/MallDetail';
import Record from '@/components/Integral/Record';
import IntegralDetail from '@/components/Integral/integralDetail';
import Test from '@/components/Test/test';
import TestResult from '@/components/Test/testResult';
import CourseData from '@/components/Test/courseData';
import Login from '@/components/Login/login';
import IntegralRule from '@/components/Integral/integralRule';
import Bindphone from '@/components/Bindphone/bindphone';
import Basestatus from '@/common/utils/baseStatus.js';
import setWechatTitle from '@/common/utils/setWechatTitle.js';

Vue.use(Router);
Vue.prototype.GLOBAL = Basestatus;
let router = new Router({
    routes: [
        {
            path: '/',
            name: '电气云课堂',
            component: Main,
            meta: {
                hasFooter: true
            }
        },
        {
            path: '/login',
            name: '登录电气云课堂',
            component: Login
        },
        {
            path: '/bindphone/:code',
            name: '绑定手机号码',
            component: Bindphone
        },
        {
            path: '/list/:categoryid',
            name: '云课堂',
            component: List
        },
        {
            path: '/list/coursedetail/:courseid',
            name: '课程详情',
            component: CourseDetail
        },
        {
            path: '/coursePoster/:id',
            name: '分享图片',
            component: CoursePoster
        },
        {
            path: '/ratings/:courseid',
            name: '评论',
            component: Ratings
        },
        {
            path: '/newCourse',
            name: '最新课程',
            component: NewCourse
        },
        {
            path: '/freeCourse',
            name: '限时免费',
            component: FreeCourse
        },
        {
            path: '/offline',
            name: '线下VIP课程',
            component: Offline,
            meta: {
                hasFooter: true
            }
        },
        {
            path: '/feedback',
            name: '意见反馈',
            component: FeedBack
        },
        {
            path: '/offlinedetail/:id',
            name: '课程详情',
            component: OfflineDetail
        },
        {
            path: '/user',
            name: '我的',
            component: User,
            meta: {
                hasFooter: true
            }
        },
        {
            path: '/invite/:invitepic',
            name: '邀请好友加入',
            component: Invite
        },
        {
            path: '/collectedList',
            name: '我的收藏',
            component: CollectedList
        },
        {
            path: '/account',
            name: '我的账户',
            component: Account
        },
        {
            path: '/help',
            name: '帮助中心',
            component: Help
        },
        {
            path: '/help/detail/:id',
            name: '帮助中心',
            component: HelpDetail
        },
        {
            path: '/mall',
            name: '积分商城',
            component: Mall
        },
        {
            path: '/mallDetail/:id',
            name: '积分详情',
            component: MallDetail
        },
        {
            path: '/record',
            name: '兑换记录',
            component: Record
        },
        {
            path: '/integralRule',
            name: '积分规则',
            component: IntegralRule
        },
        {
            path: '/integralDetail',
            name: '积分详情',
            component: IntegralDetail
        },
        {
            path: '/member',
            name: '我的会员',
            component: Member
        },
        {
            path: '/user/myCourse',
            name: '我的课程',
            component: MyCourse
        },
        {
            path: '/test/test/:courseid',
            name: '课后测试',
            component: Test
        },
        {
            path: '/testResult/:id',
            name: '测试报告',
            component: TestResult
        },
        {
            path: '/test/courseData',
            name: '资料分享',
            component: CourseData
        }
    ]
});
router.afterEach((to, from) => {
    // if(to.path!='/test/courseData'){
    //     Vuex.commit('LoadTrue');
    // }
    let title = to.name;
    setWechatTitle(title);
});
export default router;