<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BaseButton from '../components/BaseButton.vue';
import { api } from '../api/services';
import { useFormValidation, validators } from '../composables/useFormValidation';

const router = useRouter();
const cart = ref([]);
const form = reactive({
  receiver_name: '',
  receiver_phone: '',
  receiver_address: ''
});

const { errors, validateForm, validateField, clearError } = useFormValidation(form, {
  receiver_name: [validators.required('收货人'), validators.maxLength('收货人', 50)],
  receiver_phone: [validators.required('收货电话'), validators.phone('收货电话')],
  receiver_address: [validators.required('收货地址'), validators.maxLength('收货地址', 255)]
});

const totalAmount = computed(() => cart.value.reduce((sum, item) => sum + Number(item.sale_price) * Number(item.quantity), 0).toFixed(2));

const loadCart = async () => {
  const result = await api.cart();
  cart.value = result.data.list;
};

const updateQty = async (item, delta) => {
  const quantity = Math.max(1, item.quantity + delta);
  await api.updateCart(item.cart_item_id, { quantity });
  await loadCart();
};

const removeItem = async (id) => {
  await api.deleteCart(id);
  await loadCart();
};

const submitOrder = async () => {
  if (!cart.value.length) {
    window.alert('购物车为空');
    return;
  }

  if (!validateForm()) return;

  try {
    const result = await api.createOrder(form);
    window.alert(`下单成功，订单号：${result.data.order_no}`);
    router.push(`/orders/${result.data.order_id}`);
  } catch (error) {
    window.alert(error.message);
  }
};

onMounted(loadCart);
</script>

<template>
  <div class="page storefront-page">
    <AppHeader />
    <section class="section container">
      <div class="cart-layout">
        <div class="table-card">
          <h2>购物车</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th>图书</th>
                <th>单价</th>
                <th>数量</th>
                <th>小计</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart" :key="item.cart_item_id">
                <td>{{ item.title }}</td>
                <td>¥{{ Number(item.sale_price).toFixed(2) }}</td>
                <td>
                  <div class="qty-box">
                    <button @click="updateQty(item, -1)">-</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="updateQty(item, 1)">+</button>
                  </div>
                </td>
                <td>¥{{ (Number(item.sale_price) * item.quantity).toFixed(2) }}</td>
                <td><button class="link-btn" @click="removeItem(item.cart_item_id)">删除</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkout-card">
          <h3>提交订单</h3>

          <div class="field-group">
            <input v-model="form.receiver_name" class="field-input" :class="{ 'input-error': errors.receiver_name }" placeholder="收货人" @blur="validateField('receiver_name')" @input="clearError('receiver_name')" />
            <p v-if="errors.receiver_name" class="field-error">{{ errors.receiver_name }}</p>
          </div>

          <div class="field-group">
            <input v-model="form.receiver_phone" class="field-input" :class="{ 'input-error': errors.receiver_phone }" placeholder="收货电话" @blur="validateField('receiver_phone')" @input="clearError('receiver_phone')" />
            <p v-if="errors.receiver_phone" class="field-error">{{ errors.receiver_phone }}</p>
          </div>

          <div class="field-group">
            <input v-model="form.receiver_address" class="field-input" :class="{ 'input-error': errors.receiver_address }" placeholder="收货地址" @blur="validateField('receiver_address')" @input="clearError('receiver_address')" />
            <p v-if="errors.receiver_address" class="field-error">{{ errors.receiver_address }}</p>
          </div>

          <div class="checkout-total">订单总额：¥{{ totalAmount }}</div>
          <BaseButton block @click="submitOrder">立即下单</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
