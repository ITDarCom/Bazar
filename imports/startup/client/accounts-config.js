
AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: false,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: true,
    negativeFeedback: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    //homeRoutePath: '/home',
    redirectTimeout: 4000,

    // Hooks
    /*
    onLogoutHook: function(){
    onSubmitHook: mySubmitFunc,
    preSignUpHook: myPreSubmitFunc,
    postSignUpHook: myPostSubmitFunc,*/

    // Texts
    texts: {
      button: {
          signUp: "سجل"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "استعادة كلمة السر"
      },
    },
});

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "اسم المستخدم",
      required: true,
      func: function(value){ return (value.length < 4); },
      errStr: 'اسم المستخدم يجب أن يقول 4 محارف على الأقل',
  },
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "البريد الإلكتروني",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'البريد الذي أدخلته غير صالح',
  },
  {
      _id: 'password',
      type: 'password',
      required: true,
      displayName: "كلمة السر",
      func: function(value){ return (value.length < 6); },
      errStr: 'كلمة السر يجب أن تكون 6 محارف على الأقل',
  }
]);