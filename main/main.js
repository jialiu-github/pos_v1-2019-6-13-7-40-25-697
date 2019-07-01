'use strict';

//TODO: 请在该文件中实现练习要求并删除此注释

function printReceipt(inputs){
    const items = findItemsByBarcodes(inputs);
    const goods = buildGoods(items);
    const recepit = buildHeader() + buildBody(goods) + buildFooter(goods);
    console.log(recepit);
}

function decode(input) {
    if(input.includes('-')){
        const number = Number(input.slice(11));
        const barcode = input.slice(0, 10);
        return {barcode, number};
    }
    return {barcode: input, number: 1};
}

function findItemsByBarcodes(inputs){
    const allItems = loadAllItems();
    return inputs.reduce((acc, current) => {
        const decodeInput = decode(current);
        acc.push({...allItems.find(i => i.barcode === decodeInput.barcode), number: decodeInput.number});
        return acc;
    }, []);
}

function buildGoods(items) {
    return attachSubtotalForGoods(groupByBarcode(items));
}

function groupByBarcode(items) {
    return items.reduce((acc, current) => {
        if(acc.find(a => a.barcode === current.barcode)) return acc;
        acc.push({...current, count: items.filter(i => i.barcode === current.barcode).reduce((acc, current) => acc += current.number, 0)});
        return acc;
    }, [])
}

function attachSubtotalForGoods(goods) {
    const promotions = loadPromotions();
    return goods.map(g => {
        const promotion = promotions.find(p => p.barcodes.includes(g.barcode)) || {type: 'None'};
        const priceCalculator = getPriceCalculator(promotion.type);
        return {...g, subtotal: priceCalculator(g)};
    })
}

function getPriceCalculator(promotionType) {
    switch(promotionType){
        case 'BUY_TWO_GET_ONE_FREE': 
            return (good) => (good.count - Math.floor(good.count/3)) * good.price;
        default:
            return (good) => good.count * good.price
    }
}

function buildHeader(){
    return '***<没钱赚商店>收据***\n';
}

function buildBody(goods) {
    return goods.reduce((acc, current) => {
        acc += `名称：${current.name}，数量：${current.count}${current.unit}，单价：${current.price.toFixed(2)}(元)，小计：${current.subtotal.toFixed(2)}(元)\n`;
        return acc;
    }, '');
}

function buildFooter(goodWithSubtotalList) {
    const total = goodWithSubtotalList.reduce((acc, current) => acc + current.subtotal, 0);
    const save =  goodWithSubtotalList.reduce((acc, current) => acc + current.count * current.price, 0) - total;
    return `----------------------
总计：${total.toFixed(2)}(元)
节省：${save.toFixed(2)}(元)
**********************`
}


function loadPromotions() {
    return [
        {
        type: 'BUY_TWO_GET_ONE_FREE',
        barcodes: [
            'ITEM000000',
            'ITEM000001',
            'ITEM000005'
        ]
        }
    ];
}

function loadAllItems() {
    return [
      {
        barcode: 'ITEM000000',
        name: '可口可乐',
        unit: '瓶',
        price: 3.00
      },
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00
      },
      {
        barcode: 'ITEM000002',
        name: '苹果',
        unit: '斤',
        price: 5.50
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00
      },
      {
        barcode: 'ITEM000004',
        name: '电池',
        unit: '个',
        price: 2.00
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50
      }
    ];
  }
  
