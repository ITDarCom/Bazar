/**
 * Created by kasem on 11.06.2016.
 */


TabularTables = {};

TabularTables.users = new Tabular.Table({
    name: "users",
    collection: Meteor.users,
    "ordering": false,
    "lengthChange": false,
    bLengthChange: false,
    responsive: true,
    autoWidth: false,
    createdRow: function( row, data, dataIndex ) {
        if (data.blocked){
            $(row).addClass( 'danger' );            
        }
        if (data.isAdmin){
            $(row).addClass( 'info' );            
        }
    },     
    "info": false,
    extraFields: ['blocked','isAdmin','lastSignIn','registerdAt'],
    allow: function (userId) {
        return (Meteor.users.findOne({_id:userId}) && Meteor.users.findOne({_id:userId}).isAdmin);
    },
    columns: [

        {data: "username", title: function(){return TAPi18n.__('users')},class: "col-md-2"},
        {
            tmpl: Meteor.isClient && Template.userAdministrativeActions,
            "searchable": false, title: '',
        },
        {
            tmpl: Meteor.isClient && Template.lastSignInTemplate,
            "searchable": false, title:  function(){return TAPi18n.__('lastSignIn')},
            class: "col-md-1"
        },
        {
            tmpl: Meteor.isClient && Template.registerdAtTemplate,
            "searchable": false, title:function(){return TAPi18n.__('registerdAt')},
            class: "col-md-1"
        }
    ]

});

