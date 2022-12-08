const template = `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
    <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
    <META NAME="referrer" CONTENT="no-referrer">

</head>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting" />
    <link rel="stylesheet" type="text/css" href="https://cloud.typography.com/6320276/6009432/css/fonts.css" />
    <title></title>
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
            text-rendering: optimizelegibility;
            -webkit-font-smoothing: antialiased;
        }

        table {
            border-spacing: 0;
        }

        table td {
            border-collapse: collapse;
        }

        .ExternalClass {
            width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        table,
        td {
            border-collapse: collapse !important;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        .yshortcuts a {
            border-bottom: none !important;
        }

        .hide {
            visibility: hidden;
            display: none;
            mso-hide: all;
        }

        .mbl-show {
            display: none;
            mso-hide: all;
        }

        .AppleLinksRed a {
            color: #C41F3E !important;
            text-decoration: none !important;
        }

        .AppleLinksBlack a {
            color: #000000 !important;
            text-decoration: none !important;
        }

        .AppleLinksGrey a {
            color: #606366 !important;
            text-decoration: none !important;
        }

        .AppleLinksWhite a {
            color: #FFFFFF !important;
            text-decoration: none !important;
        }

        #outlook a {
            padding: 0;
        }

        u+#body a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
        }
    </style>
    <style type="text/css">
        @media screen and (max-width: 639px) {

            .force-row,
            .container {
                width: 100% !important;
                max-width: 100% !important;
            }

            .mob-stack {
                width: 100% !important;
                display: block !important;
            }

            .col {
                width: 100% !important;
            }

            .container-padding {
                padding-left: 20px !important;
                padding-right: 20px !important;
            }

            .cta-btn {
                display: block !important;
                width: auto !important;
                min-width: 230px !important;
            }

            .mbl-hide {
                display: none !important;
                font-size: 0;
                max-height: 0;
                line-height: 0;
                padding: 0;
                mso-hide: all;
            }

            .mbl-show {
                display: block !important;
                max-height: none !important;
            }

            .mbl-show img {
                display: block !important;
                border: 0 !important;
            }

            .mbl-center {
                text-align: center !important;
            }

            .mbl-left {
                text-align: left !important;
            }

            .mbl-right {
                text-align: right !important;
            }

            .body-text {
                padding-left: 20px !important;
                padding-right: 20px !important;
            }

            .gmail-fix a {
                color: #D40139 !important;
                text-decoration: none !important;
            }

            .px-0 {
                padding-right: 0 !important;
                padding-left: 0 !important
            }

            .px-1 {
                padding-right: 10px !important;
                padding-left: 10px !important
            }

            .px-2 {
                padding-right: 20px !important;
                padding-left: 20px !important
            }

            .px-3 {
                padding-right: 30px !important;
                padding-left: 30px !important
            }

            .px-4 {
                padding-right: 40px !important;
                padding-left: 40px !important
            }

            .px-5 {
                padding-right: 50px !important;
                padding-left: 50px !important
            }

            .py-0 {
                padding-top: 0 !important;
                padding-bottom: 0 !important
            }

            .py-1 {
                padding-top: 10px !important;
                padding-bottom: 10px !important
            }

            .py-2 {
                padding-top: 20px !important;
                padding-bottom: 20px !important
            }

            .py-3 {
                padding-top: 30px !important;
                padding-bottom: 30px !important
            }

            .py-4 {
                padding-top: 40px !important;
                padding-bottom: 40px !important
            }

            .py-5 {
                padding-top: 50px !important;
                padding-bottom: 50px !important
            }

            .pt-0 {
                padding-top: 0 !important
            }

            .pt-1 {
                padding-top: 10px !important
            }

            .pt-2 {
                padding-top: 20px !important
            }

            .pt-3 {
                padding-top: 30px !important
            }

            .pt-4 {
                padding-top: 40px !important
            }

            .pt-5 {
                padding-top: 50px !important
            }

            .pb-0 {
                padding-bottom: 0 !important
            }

            .pb-1 {
                padding-bottom: 10px !important
            }

            .pb-2 {
                padding-bottom: 20px !important
            }

            .pb-3 {
                padding-bottom: 30px !important
            }

            .pb-4 {
                padding-bottom: 40px !important
            }

            .pb-5 {
                padding-bottom: 50px !important
            }

            .pr-0 {
                padding-right: 0 !important
            }

            .pr-1 {
                padding-right: 10px !important
            }

            .pr-2 {
                padding-right: 20px !important
            }

            .pr-3 {
                padding-right: 30px !important
            }

            .pr-4 {
                padding-right: 40px !important
            }

            .pr-5 {
                padding-right: 50px !important
            }

            .pl-0 {
                padding-left: 0 !important
            }

            .pl-1 {
                padding-left: 10px !important
            }

            .pl-2 {
                padding-left: 20px !important
            }

            .pl-3 {
                padding-left: 30px !important
            }

            .pl-4 {
                padding-left: 40px !important
            }

            .pl-5 {
                padding-left: 50px !important
            }
        }
    </style>
    <!--[if mso]>
   <style>
   .mso-pl {
   padding-left:0px !important;
}

 .mso-0 {
  padding:0 !important;
}

 .mso-pt {
  padding-top:30px !important;
}

.mso18 {
 font-size:18px !important;
}

</style>
  <![endif]-->
    <!--[if gte mso 9]><xml>  <o:OfficeDocumentSettings>  <o:AllowPNG/>  <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <style type="text/css"> body, table, td, div, p, span, a, strong, h1, h2, h3, h4, h5, h6 {font-family: Arial, sans-serif !important;} table {border-collapse: collapse!important;} sup {font-size:100%!important;} </style> <![endif]-->
</head>

<body class="body" style="margin:0; padding:0;" bgcolor="#ffffff" leftmargin="0" topmargin="0" marginwidth="0"
    marginheight="0">
    <!-- 100% background wrapper (grey background) -->
    <table role="presentation" border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
        <tr>
            <td align="center" valign="top" bgcolor="#ffffff" style="background-color: #ffffff;">
                <div style="max-width:640px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;">
                    <!--[if (gte mso 9)|(IE)]>                     <table role="presentation" width="640" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top">                     <![endif]-->
                    <!-- Start Content -->
                        %%Content_Block%%
                    <!-- End Content -->
                    <!--[if (gte mso 9)|(IE)]>                     </td></tr></table>                     <![endif]-->
                    <!--/600px container -->
                </div>
            </td>
        </tr>
    </table>
    <!--/100% background wrapper-->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="mbl-hide"
        style="border-spacing:0;font-family: 'Whitney A', 'Whitney B', Arial, sans-serif;color:#666666;">
        <tr>
            <td height="1" class="mbl-hide"
                style="min-width:640px;font-size:0px;line-height:0px;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;">
                <img height="1" name="Cont_5"
                    src="https://www.sc.pages02.net/lp/39688/437139/img/android-fix-spacer.png"
                    style="min-width:640px;text-decoration:none;border-style:none;-ms-interpolation-mode:bicubic;border-width:0;"
                    alt="" />
            </td>
        </tr>
    </table>
</body>

</html>



`

module.exports={
    template
}