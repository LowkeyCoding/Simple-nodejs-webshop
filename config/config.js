function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

//Email config
define("gmail_username", "");
define("gmail_password", "");
define("site_url", "");

//Website Titles
define("title_Sitename", "");
define("title_Privacy_policy", "");
define("title_Refund_policy", "");
define("title_Terms_of_service", "");
define("title_Profile", "");
define("title_Orders", "");
define("title_Admin_panel", "");
define("title_Order_processing", "");
define("title_Order_shipping", "");
define("title_Add_product", "");
define("title_Remove_product", "");
define("title_Signup", "");
define("title_Signin", "");
define("title_Invoice", "");
define("title_Shopping_cart", "")

//App config
define("db_link", "");
define("hash", "");
define("Sessions_cookie_max_age", ( 3 * 60 * 60 * 1000 ) + ( 0 * 60 * 1000 ) + ( 0 * 1000  ) + ( 0 ) ); /* (hours) (minuts) (seconds) (milliseconds) */