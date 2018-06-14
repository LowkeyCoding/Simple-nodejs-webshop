module.exports = function cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    
    this.setAmount= function(item, id, amount){
        var storedItem = this.items[id];
        if (!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0}
        }
        var diffrence = storedItem.qty - amount;
        storedItem.qty = amount;
        if (storedItem.qty === 0 |storedItem.qty < 1){
            delete this.items[id];
        }
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty -= diffrence;
        this.totalPrice = this.totalPrice - diffrence*storedItem.item.price;
    }
    this.remove = function(id){
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }
    this.generateArray = function(cart){
        var arr = [];
        for (var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
};