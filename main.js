var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">

        <div class="product-image">
            <img :src="image" :alt="altText">
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else
            :class="{ outStock: !inStock }">Out of Stock</p>

            <info-tabs :shipping="shipping" :details="details"></info-tabs>

<!--
            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>
-->                   

            <div v-for="(variant, index) in variants" 
                :key="variant.variantId"
                class="color-box"
                :style="{ backgroundColor: variant.variantColor }"
                @mouseover="updateProduct(index)">
            </div>

            <button v-on:click="addToCart" 
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Add to cart - complex
            </button>
            <button @click="removeFromCart">Remove from cart</button>
        </div>

        <product-tabs :reviews="reviews"></product-tabs>
    </div>
    `,
    data() {
        return {
            brand: 'Vue Masterful',
            product: 'Socks',
            selectedVariant: 0,
            altText: 'A pair of sock',
            linkSocks: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            description: 'A pair of warm, fuzzy ',
            onSale: true,
            details: ["80% cotton", "20% polyester", "Gender-neutral"], //Array
            variants: [
                {
                    variantId: 2234,
                    variantColor: "#23864F",
                    variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "#203042",
                    variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],                           //Objeto
            sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
            onSale: false,
            reviews: []
        }
    },
    methods: {
        addToCart: function () {
           this.$emit('add-to-cart',  this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
        },
        removeFromCart() {
           this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale!'
            } else {
                return this.brand + ' ' + this.product + ' are not on sale!'
            }
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview  => {
            this.reviews.push(productReview)
        })
    },
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="Name">
        </p>

        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review" placeholder="Review"></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>

        </br>

        <p>Would you recommend this product?</p>
            <label>
                Yes
                <input type="radio" v-model="recommend" value="Yes">
            </label>
            <label>
                No
                <input type="radio" v-model="recommend" value="No">
            </label>           
            
        </p>

        <p>
            <input type="submit" value="Submit">
        </p>
    </form>

    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = []
            if (this.name && this.review && this.rating) {
                let productReview  = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend

                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null,
                this.review = null,
                this.rating = null,
                this.recommend = null
            }
            else {
                if (!this.name) this.errors.push("Name required")
                if (!this.review) this.errors.push("Review required")
                if (!this.rating) this.errors.push("Rating required")
                if(!this.recommend) this.errors.push("Recommendation required.")
            }
        }
    }
})


Vue.component("product-tabs", {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
        <div>
            <div>
                <span class="tab" v-for="(tab, index) in tabs"
                    :class="{ activeTab: selectedTab === tab}"
                    :key="index"
                    @click="selectedTab = tab">{{ tab }}
                </span>
            </div>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>Name: {{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>Review: {{ review.review }}</p>
                        <p>Recommend: {{ review.recommend }}</p>
                    </li>
                </ul>
            </div>

            <div v-show="selectedTab === 'Make a Review'">
                <product-review></product-review>
            </div>
        </div>

    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

Vue.component('info-tabs', {
    props: {
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <ul>
               <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
               :key="tab">
               {{ tab }}</span>
            </ul>

            <div v-show="selectedTab === 'Shipping'">
                <p>{{ shipping }}</p>
            </div>

            <div v-show="selectedTab === 'Details'">
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['Shipping', 'Details'],
            selectedTab: 'Shipping'
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeItem(id) {
            this.cart.pop(id)
        }
    }
})