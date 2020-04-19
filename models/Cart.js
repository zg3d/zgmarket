module.exports = function cart(oldCart){

    if(oldCart.items != undefined){
        this.items = oldCart.items;
    }
    else{
        this.items = {};
    };
    this.totalQuantity = oldCart.totalQuantity || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.ImagePath = oldCart.ImagePath || null;
    
    this.add = function(item, id){
        let storedItem = this.items[id];
        if (!storedItem){
            storedItem = this.items[id] = {
                items: item, qty: 0, Price: 0
            };
        }
        storedItem.qty++;
        storedItem.Price= storedItem.items.Price * storedItem.qty;
        this.totalQuantity += 1;
        this.totalPrice += storedItem.items.Price;
    };

    this.reduceByOne = (id) =>{
        this.items[id].qty--;
        this.items[id].Price -= this.items[id].items.Price;
        this.totalQuantity--;
        this.totalPrice -= this.items[id].items.Price;

        if (this.items[id].qty <= 0){
            delete this.items[id];
        }
    };

     this.increaseByOne = (id) =>{
        this.items[id].qty++;
        this.items[id].Price += this.items[id].items.Price;
        this.totalQuantity++;
        this.totalPrice += this.items[id].items.Price;

        if (this.items[id].qty <= 0){
            delete this.items[id];
        }
    };

    this.removeItem = (id) =>{
        this.totalQuantity -= this.items[id].qty;
        this.totalPrice -= this.items[id].Price;
        delete this.items[id];
    }

    this.generateArray = function(){
        const arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }

}