import React, {useEffect, useMemo, useState} from 'react';
import {productActions, productSelector, useAppDispatch, useAppSelector} from "../../../redux";
import NutrientList from "../../nutrient/NutrientList";
import '../productCard/product-card.styles.scss'
import './product-present.styles.scss'
import {useCart} from "../../../hooks/useCart";
import '../../layout/layout/layout.styles.scss'
import AddToCartOnPresentation from "../../cart/addToCartButton/AddToCartBtn";
import {DatabaseCartProduct, Product} from "../../../common/types";

const currency = '₽'
export const baseUrl = `https://storage.yandexcloud.net/zharpizza-bucket/static/images`

const ProductPresentation = () => {
    // todo: fix notification
    const {
        presentedProduct,
        isPresentingNow,
        presentedProductCartQuantity,
        totalCartPrice
    } = useAppSelector(productSelector)
    const dispatch = useAppDispatch()

    const cart = useCart()

    const [isNotified, setIsNotified] = useState<boolean>(false)
    const [isProductInCart, setIsProductInCart] = useState<DatabaseCartProduct>(null)
    const [isLongName, setIsLongName] = useState<boolean>(false)
    const [longName, setLongName] = useState<string>('')

    const startingQuantity = useMemo(() => {
        if(presentedProduct){
            const cartP = cart.getById(presentedProduct.id)
            if(!cartP) return 0
            return cartP.quantity
        }
        return 0
    },[isPresentingNow])
    const productImage = useMemo(() => {
        if(presentedProduct) return `${baseUrl}/${presentedProduct.id}.jpg`
        return ""
    },[presentedProduct])
    const isEmptyCart = useMemo(() => {
        const c = cart.getCart()
        const onCondition = !(c.length > 0)
        return onCondition
    },[isProductInCart])


    useEffect(() => {
        const body = document.querySelector('body')
        dispatch(productActions.setTotalCartPrice(cart.calculateCartTotalPrice()))

        if(isPresentingNow){
            body!.style.overflow = 'hidden'
        }

        return () => {
            body!.style.overflow = 'visible'
        }
    }, [isPresentingNow])
    useEffect(() => {
        if(presentedProduct !== null) {
            splitLongName()
            checkIsInCart(presentedProduct.id)
        }

    },[isPresentingNow,totalCartPrice])
    useEffect(() => {
        if(startingQuantity < presentedProductCartQuantity){
            setIsNotified(true)
        }else {
            setIsNotified(false)
        }
    },[presentedProductCartQuantity,totalCartPrice])
    useEffect(() => {
        dispatch(productActions.setCartEmpty(isEmptyCart))
    },[isEmptyCart])

    function splitLongName(){
        const {name} = presentedProduct
        const len = name.split(' ').length
        if(len === 1) {
            setIsLongName(false)
            return
        }
        const secondWord = name.split(' ').pop()
        setIsLongName(true)
        setLongName(secondWord)
    }

    function addToCart(product:Product){
        if(isProductInCart) return
        const cartProduct:DatabaseCartProduct = {
            category: product.category,
            id: product.id,
            quantity: 1,
            translate: product.translate,
            price: product.price
        }
        cart.addProduct(cartProduct)
        const totalCartPrice = cart.calculateCartTotalPrice()
        dispatch(productActions.setTotalCartPrice(totalCartPrice))
    }

    function checkIsInCart(id: number){
        const product = cart.getById(id)
        if(!product) return setIsProductInCart(null)
        dispatch(productActions.setPresentedProductQuantity(product.quantity))
        return setIsProductInCart(product)
    }

    return (
        <div className={ isPresentingNow ? 'product_presentation' : 'product_presentation hidden'}>
            {
                presentedProduct !== null &&
                <>
                    <div className='top_part'>
                        <div className='title presentation'>
                        <span>
                        <p className='name presentation'>{presentedProduct.name}</p>
                            {isLongName && <p className='long_name'>{longName}</p>}
                        </span>
                            <p className='price'>{presentedProduct.price} {currency}</p>
                        </div>
                        <img className='image presentation' src={productImage} alt="Изображение"/>
                        <div className='miscellaneous'>
                            <div>
                                <p className='description'>{presentedProduct.description}</p>
                                {
                                    presentedProduct.features.nutrients &&
                                    <NutrientList
                                        isPresentingNow={isPresentingNow}
                                        nutrients={presentedProduct.features.nutrients}
                                    />
                                }
                            </div>

                        </div>
                    </div>
                    <AddToCartOnPresentation
                        isProductInCart={isProductInCart}
                        cart={cart}
                        addToCart={addToCart}
                        isNotified={isNotified}
                    />
                </>
            }
        </div>
    );
};

export default ProductPresentation;