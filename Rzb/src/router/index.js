import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/home'

import MemberList from '@/components/Member/memberList'
import CheckMemberList from '@/components/Member/checkList'
import Check_view from '@/components/Member/check_view'
import Member_view from '@/components/Member/menber_view'

import WorkAll from '@/components/Work/all'
import WorkPending from '@/components/Work/pending'
import WorkFinishing from '@/components/Work/finishing'
import WorkRefund from '@/components/Work/refund'
import WorkFinished from '@/components/Work/finished'
import WorkInvalid from '@/components/Work/invalid'
import WorkCertification from '@/components/Work/certification'
import WorkCertificationView from '@/components/Work/certification_view'
import WorkView from '@/components/Work/view'

import PayList from '@/components/Pay/list'
import PayList_view from '@/components/Pay/trade_view'
import PayApplication from '@/components/Pay/application'
import PayApplication_view from '@/components/Pay/application_view'

import plantform_banner from '@/components/Plantform/banner'
import BannerManage from '@/components/Plantform/banner_manage'
import plantform_parameter from '@/components/Plantform/parameter'
import plantform_memberAgreement from '@/components/Plantform/member_agreement'
import plantform_jworkAgreement from '@/components/Plantform/jwork_agreement'
import plantform_companyAgreement from '@/components/Plantform/company_agreement'
import plantform_help from '@/components/Plantform/help'
import plantform_help_update from '@/components/Plantform/help_update'
import plantform_feedBack from '@/components/Plantform/feed_back'
import plantform_feedBack_edit from '@/components/Plantform/feed_back_edit'

import UserList from '@/components/Manager/userList'
import UserManage from '@/components/Manager/user_manage'
import resetPwd from '@/components/Manager/user_resetpwd'
import RoleList from '@/components/Manager/roleList'
import RoleManage from '@/components/Manager/role_manage'
import permission from '@/components/Manager/role_permission'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '*',
      redirect: '/home'
    },
    {
      path: '/',
      redirect: '/home',
      meta: {
        opendPath: "/home"
      }
    },
    {
      path: '/home',
      component: Home,
      meta: {
        opendPath: '/home',
        keepAlive: true
      }
    },
    {
      path: '/RZB_member_list',
      component: MemberList,
      meta: {
        menuId: "181",
        opendPath: '/RZB_member_list',
        keepAlive: true
      }
    },
    {
      path: '/RZB_check_pending',
      component: CheckMemberList,
      meta: {
        menuId: "181",
        opendPath: '/RZB_check_pending',
        keepAlive: true
      }
    },
    {
      path: '/pendingManage/:id/type/:type',
      name: 'check',
      component: Check_view,
      meta: {
        menuId: "181",
        opendPath: '/RZB_check_pending'
      }
    },
    {
      path: '/listManage/:id',
      component: Member_view,
      meta: {
        menuId: "181",
        opendPath: '/RZB_member_list'
      }
    },

    {
      path: '/RZB_work_all',
      component: WorkAll,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_all',
        keepAlive: true
      }
    },
    {
      path: '/RZB_work_all/:id',
      component: WorkView,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_all'
      }
    },
    {
      path: '/RZB_work_pending',
      component: WorkPending,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_pending',
        keepAlive: true
      }
    },
    {
      path: '/RZB_work_pending/:id',
      component: WorkView,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_pending'
      }
    },
    {
      path: '/RZB_work_finishing',
      component: WorkFinishing,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_finishing',
        keepAlive: true
      }
    },
    {
      path: '/RZB_work_finishing/:id',
      component: WorkView,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_finishing'
      }
    },
    {
      path: '/RZB_work_refund',
      component: WorkRefund,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_refund',
        keepAlive: true
      }
    },
    {
      path: '/RZB_work_refund/:id',
      component: WorkView,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_refund'
      }
    },
    {
      path: '/RZB_work_finished',
      component: WorkFinished,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_finished',
        keepAlive: true
      }
    },
    {
      path: '/RZB_work_finished/:id',
      component: WorkView,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_finished'
      }
    },
    {
      path: '/RZB_work_invalid',
      component: WorkInvalid,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_invalid',
        keepAlive: true
      }
    },
    {
      path: '/RZB_work_invalid/:id',
      component: WorkView,
      meta: {
        menuId: "182",
        opendPath: '/RZB_work_invalid'
      }
    },
    {
      path: '/RZB_product_certification',
      component: WorkCertification,
      meta: {
        menuId: "182",
        opendPath: '/RZB_product_certification',
      }
    },
    {
      path: '/RZB_product_certification/:id',
      component: WorkCertificationView,
      meta: {
        menuId: "182",
        opendPath: '/RZB_product_certification'
      }
    },

    {
      path: '/RZB_pay_list',
      component: PayList,
      meta: {
        menuId: "183",
        opendPath: '/RZB_pay_list',
        keepAlive: true
      }
    },
    {
      path: '/trade_view/:id',
      component: PayList_view,
      meta: {
        menuId: "183",
        opendPath: '/RZB_pay_list'
      }
    },
    {
      path: '/RZB_pay_application',
      component: PayApplication,
      meta: {
        menuId: "183",
        opendPath: '/RZB_pay_application',
        keepAlive: true
      }
    },
    {
      path: '/withdrawal_view/:id',
      component: PayApplication_view,
      meta: {
        menuId: "183",
        opendPath: '/RZB_pay_application'
      }
    },

    {
      path: '/RZB_plantform_banner',
      component: plantform_banner,
      meta: {
        menuId: "184",
        opendPath: '/RZB_plantform_banner'
      }
    },
    {
      path: '/bannerManage/:id',
      component: BannerManage,
      meta: {
        menuId: "184",
        opendPath: '/RZB_plantform_banner'
      }
    },
    {
      path: '/RZB_plantform_parameter',
      component: plantform_parameter,
      meta: {
        menuId: "184",
        opendPath: '/RZB_plantform_parameter'
      }
    },
    {
      path: '/RZB_member_agreement',
      component: plantform_memberAgreement,
      meta: {
        menuId: "184",
        opendPath: '/RZB_member_agreement'
      }
    },
    {
      path: '/RZB_jwork_agreement',
      component: plantform_jworkAgreement,
      meta: {
        menuId: "184",
        opendPath: '/RZB_jwork_agreement'
      }
    },
    {
      path: '/RZB_company_agreement',
      component: plantform_companyAgreement,
      meta: {
        menuId: "184",
        opendPath: '/RZB_company_agreement'
      }
    },
    {
      path: '/RZB_plantform_help',
      component: plantform_help,
      meta: {
        menuId: "184",
        opendPath: '/RZB_plantform_help',
        keepAlive: true
      }
    },
    {
      path: '/RZB_plantform_help_update/:id',
      component: plantform_help_update,
      meta: {
        menuId: "184",
        opendPath: '/RZB_plantform_help'
      }
    },
    {
      path: '/RZB_feed_back',
      component: plantform_feedBack,
      meta: {
        menuId: "184",
        opendPath: '/RZB_feed_back',
        keepAlive: true
      }
    },
    {
      path: '/RZB_feed_back_edit/:id',
      name: 'RZB_feed_back_edit',
      component: plantform_feedBack_edit,
      meta: {
        menuId: "184",
        opendPath: '/RZB_feed_back'
      }
    },


    {
      path: '/RZB_admin_user',
      component: UserList,
      meta: {
        menuId: "185",
        opendPath: '/RZB_admin_user',
        keepAlive: true
      }
    },
    {
      path: '/userManage/:id',
      component: UserManage,
      meta: {
        menuId: "185",
        opendPath: '/RZB_admin_user'
      }
    },
    {
      path: '/resetPassword/:id',
      component: resetPwd,
      meta: {
        menuId: "185",
        opendPath: '/RZB_admin_user'
      }
    },

    {
      path: '/RZB_admin_role',
      component: RoleList,
      meta: {
        menuId: "185",
        opendPath: '/RZB_admin_role',
        keepAlive: true
      }
    },
    {
      path: '/roleManage/:id',
      component: RoleManage,
      meta: {
        menuId: "185",
        opendPath: '/RZB_admin_role'
      }
    },
    {
      path: '/permission/:id',
      component: permission,
      meta: {
        menuId: "185",
        opendPath: '/RZB_admin_role'
      }
    },
  ]
})
router.beforeEach((to, from, next) => {
  next();
})

export default router;