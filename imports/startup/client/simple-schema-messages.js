//https://gist.github.com/homaily/8672499
SimpleSchema.RegEx.SaudiMobile = /^(009665|9665|\+9665|05|\d)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/i

SimpleSchema.RegEx.EnglishName = /(^[A-Za-z-]*$)/i
SimpleSchema.RegEx.ArabicName = /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF\s]*$/i



SimpleSchema.messages({
  required: "حقل [label] إلزامي",
  minString: "حقل [label] يجب أن يكون [min] محارف على الأقل",
  maxString: "حقل [label] لا يمكن أن يتجاوز [max] محرفا",
  minNumber: "[label] يجب أن يكون على الأقل [min]",
  maxNumber: "[label] لا يمكن أن يتجاوز [max]",
  minDate: "[label] يجب أن يكون مساويا أو بعد [min]",
  maxDate: "[label] لا يمكن أن يكون بعد [max]",
  badDate: "[label] ليس تاريخا صحيحا",
  minCount: "You must specify at least [minCount] values",
  maxCount: "You cannot specify more than [maxCount] values",
  noDecimal: "[label] يجب أن يكون عددا صحيحا",
  notAllowed: "[value] ليس قيمة مسموح بها",
  expectedString: "[label] يجب أن يكون نصا",
  expectedNumber: "[label] يجب أن يكون رقما",
  expectedBoolean: "[label] must be a boolean",
  expectedArray: "[label] must be an array",
  expectedObject: "[label] must be an object",
  expectedConstructor: "[label] must be a [type]",
  regEx: [
    {msg: "[label] failed regular expression validation"},
    {exp: SimpleSchema.RegEx.Email, msg: "[label] يجب أن يكون عنوان بريد إلكتروني صحيح"},
    {exp: SimpleSchema.RegEx.SaudiMobile, msg: "[label] يجب أن يكون هاتف جوال صحيح مسبوقا برمز الشبكة"},
    {exp: SimpleSchema.RegEx.WeakEmail, msg: "[label] يجب أن يكون عنوان بريد إلكتروني صحيح"},
    {exp: SimpleSchema.RegEx.Domain, msg: "[label] must be a valid domain"},
    {exp: SimpleSchema.RegEx.WeakDomain, msg: "[label] must be a valid domain"},
    {exp: SimpleSchema.RegEx.IP, msg: "[label] must be a valid IPv4 or IPv6 address"},
    {exp: SimpleSchema.RegEx.IPv4, msg: "[label] must be a valid IPv4 address"},
    {exp: SimpleSchema.RegEx.IPv6, msg: "[label] must be a valid IPv6 address"},
    {exp: SimpleSchema.RegEx.Url, msg: "[label] must be a valid URL"},
    {exp: SimpleSchema.RegEx.Id, msg: "[label] must be a valid alphanumeric ID"},
    {exp: SimpleSchema.RegEx.EnglishName, msg:"يجب ان يكون [label]"},
    {exp: SimpleSchema.RegEx.ArabicName, msg:"يجب ان يكون [label] باللغة العربية"},
  ],
  keyNotInSchema: "[key] is not allowed by the schema"
});
