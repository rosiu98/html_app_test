let templateMeridian = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8"> <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting"> <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no"> <!-- Tell iOS not to automatically link certain text strings. -->
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Meridian Template</title> <!-- The title tag shows in email notifications, like Android 4.4. -->

    <!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->

    <!-- Web Font / @font-face : BEGIN -->
    <!-- NOTE: If web fonts are not required, lines 23 - 41 can be safely removed. -->

    <!--[if mso]>
    <style type="text/css">
    body, table, td, a, h1, h2, p, b, span {font-family: Arial, Helvetica, sans-serif !important;mso-hyphenate:none;}
    b {font-family: Arial, Helvetica, sans-serif; font-weight: 700 !important;}
    </style>
    <![endif]-->

    <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
    <!--[if !mso]><!-->
    <link rel="stylesheet" href="https://use.typekit.net/uhk6msu.css">
    <!--<![endif]-->

    <!-- Web Font / @font-face : END -->

    <!-- Makes bullets consitent in IE -->

    <!--[if gte mso 9]>
      <style>
        li {
        text-indent: -1em; /* Normalise space between bullets and text */
        }

        ul {
        margin-top:0px !important;
        margin-left:15px !important;
        padding: 0 !important;
        list-style-position: inside !important;
        }

        sub {
        line-height: 100%;
        font-size: 100%;
        }
      </style>
    <![endif]-->

    <!-- CSS Reset : BEGIN -->
    <style type="text/css">
        /* What it does: Tells the email client that only light styles are provided but the client can transform them to dark. A duplicate of meta color-scheme meta tag above. */
        :root {
            color-scheme: light;
            supported-color-schemes: light;
        }

        /* What it does: Remove spaces around the email design added by some email clients. */
        /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
        html,
        body {
            margin: 0 auto !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* What it does: Stops email clients resizing small text. */
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        .pd-valign>* {
            vertical-align: middle !important;
        }

        /* What it does: Centers email on Android 4.4 */
        /* div[style*="margin: 16px 0"] {
            margin: 0 !important;
        } */
        /* What it does: forces Samsung Android mail clients to use the entire viewport */
        #MessageViewBody,
        #MessageWebViewDiv {
            width: 100% !important;
        }

        /* What it does: Stops Outlook from adding extra spacing to tables. */
        table,
        td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }

        /* What it does: Fixes webkit padding issue. */
        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }

        /* What it does: Uses a better rendering method when resizing images in IE. */
        img {
            -ms-interpolation-mode: bicubic;
        }

        /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
        a {
            text-decoration: none;
        }

        .ii a[href] {
            color: inherit !important;
        }

        body a {
            color: inherit !important;
            text-decoration: none;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* What it does: A work-around for email clients meddling in triggered links. */
        a[x-apple-data-detectors],
        /* iOS */
        .unstyle-auto-detected-links a,
        .aBn {
            border-bottom: 0 !important;
            cursor: default !important;
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* What it does: Prevents Gmail from changing the text color in conversation threads. */
        .im {
            color: inherit !important;
        }

        /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
        .a6S {
            display: none !important;
            opacity: 0.01 !important;
        }

        /* If the above doesn't work, add a .g-img class to any image in question. */
        img.g-img+div {
            display: none !important;
        }

        /* .hide-mobile {
          display: inline-block !important;
          max-height: none !important;
        } */

        .hide-desktop {
            display: none !important;
            max-height: 0 !important;
        }

        b,
        strong {
            font-weight: 900 !important;
        }

        sup {
            font-size: 10px;
            line-height: 0;
            vertical-align: 4px;
        }

        /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
        /* Create one of these media queries for each additional viewport size you'd like to fix */

        /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u~div .email-container {
                min-width: 320px !important;
            }
        }

        /* iPhone 6, 6S, 7, 8, and X */
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u~div .email-container {
                min-width: 375px !important;
            }
        }

        /* iPhone 6+, 7+, and 8+ */
        @media only screen and (min-device-width: 414px) {
            u~div .email-container {
                min-width: 414px !important;
            }
        }
    </style>
    <!-- CSS Reset : END -->

    <!-- Progressive Enhancements : BEGIN -->
    <style type="text/css">
        /* What it does: Hover styles for buttons */
        .button-td,
        .button-a {
            transition: all 100ms ease-in;
        }

        .button-td-primary:hover,
        .button-a-primary:hover {
            background: #FFA500 !important;
            border-color: #FFA500 !important;
        }

        /* Media Queries */
        @media screen and (max-width: 680px) {

            /* What it does: Forces table cells into full-width rows. */
            .stack-column,
            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .full-width {
                width: 100% !important;
                max-width:100%; !important;
            }

            /* What it does: Forces table cells into full-width rows. */
            .stack-column-alt,
            .stack-column-6 {
                display: inline-block !important;
                width: auto !important;
                direction: ltr !important;
            }

            /* And center justify these ones. */
            .stack-column-center {
                text-align: left !important;
            }

            .stack-column-alt,
            .stack-column-6 {
                text-align: center !important;
            }

            .pd-mobile-shift {
                padding-top: 0 !important;
            }

            /* What it does: Generic utility class for centering. Useful for images, buttons, and nested tables. */
            .center-on-narrow {
                text-align: center !important;
                display: block !important;
                margin-left: auto !important;
                margin-right: auto !important;
                float: none !important;
            }

            .left-on-narrow {
                text-align: center !important;
                display: block !important;
                /* margin-left: auto !important; */
                margin-right: auto !important;
                float: none !important;
            }

            .logo-center-on-narrow {
                float: left !important;
                margin-left: 0 !important;
                margin-right: 10px !important;
            }

            table.center-on-narrow {
                display: inline-block !important;
            }

            .hide-mobile {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
                max-width: 0 !important;
                max-height: 0 !important;
                overflow: hidden !important;
            }

            .hide-desktop {
                display: inline-block !important;
                max-height: none !important;
            }

            .pd-center-padding {
                padding-left: 20px !important;
                padding-right: 20px !important
            }

            .pd-center-padding-small {
                padding-left: 0 !important;
                padding-right: 0 !important
            }

            .pd-center-padding-footer {
                padding-left: 10px !important;
                padding-right: 10px !important
            }

            .pd-center-padding-footer-alt {
                padding-left: 5px !important;
                padding-right: 5px !important
            }

            .pd-disclaimer p {
                font-size: 15px !important;
                line-height: 21px !important;
            }

            img.fluid {
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                margin-left: auto !important;
                margin-right: auto !important;
            }
        }
    </style>

    <style type="text/css">
        /* Media Queries */
        @media screen and (max-width: 680px) {

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

            .px-0 {
                padding-left: 0 !important;
                padding-right: 0 !important
            }

            .px-1 {
                padding-left: 10px !important;
                padding-right: 10px !important
            }

            .px-2 {
                padding-left: 20px !important;
                padding-right: 20px !important
            }

            .px-3 {
                padding-left: 30px !important;
                padding-right: 30px !important
            }

            .px-4 {
                padding-left: 40px !important;
                padding-right: 40px !important
            }

            .px-5 {
                padding-left: 50px !important;
                padding-right: 50px !important
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

            .h-sm {
                font-size: 28px !important;
            }
        }
    </style>

    <!-- Progressive Enhancements : END -->

</head>
<!--
 The email background color (#EAEAEA) is defined in three places:
 1. body tag: for most email clients
 2. center tag: for Gmail and Inbox mobile apps and web versions of Gmail, GSuite, Inbox, Yahoo, AOL, Libero, Comcast, freenet, Mail.ru, Orange.fr
 3. mso conditional: For Windows 10 Mail
-->

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #EAEAEA;">
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #EAEAEA;">
    <tr>
    <td>
    <![endif]-->
    <div style="width:100%;max-width: 680px; margin: 0 auto;">
        <!--[if mso]>
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="680">
            <tr>
            <td>
            <![endif]-->
        <table role="presentation" border="0" width="100%" cellpadding="0" cellspacing="0" style="width:100%;">
            <tr>
                <td style="padding:0;">
                    <!-- Start Content -->
                        %%Content_Block%%
                    <!-- End Content -->
                </td>
            </tr>
        </table>
        <!--[if mso]>
            </td>
            </tr>
            </table>
            <![endif]-->
    </div>
    <!--[if mso | IE]>
    </td>
    </tr>
    </table>
    <![endif]-->
    <div style="margin:0;display:none;max-height:0;font-size:0;line-height:0; overflow:hidden; mso-hide:all;" aria-hidden="true">
    </div>
</body>

</html>`;

export default templateMeridian;
