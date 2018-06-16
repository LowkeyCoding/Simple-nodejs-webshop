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
define("title_Privacy_policy", "Privacy policy");
define("title_Refund_policy", "Refund policy");
define("title_Terms_of_service", "Terms of Service");
define("title_Profile", "Profile");
define("title_Orders", "Orders");
define("title_Admin_panel", "Admin panel");
define("title_Order_processing", "Order Processing");
define("title_Order_shipping", "Order Shipping");
define("title_Add_product", "Add product");
define("title_Update_product", "Update product");
define("title_Remove_product", "Remove product");
define("title_Signup", "Signup");
define("title_Signin", "Signin");
define("title_Invoice", "Invoice");
define("title_Shopping_cart", "Shopping cart")

//App config
define("db_link", "");
define("hash", "");
define("Sessions_cookie_max_age", ( 3 * 60 * 60 * 1000 ) + ( 0 * 60 * 1000 ) + ( 0 * 1000  ) + ( 0 ) ); /* (hours) (minuts) (seconds) (milliseconds) */