<template>
    <el-button class="form-btn">
        <slot></slot>
    </el-button>
</template>

<script>
    export default {
        name: 'form-button'
    }
</script>

<style scoped>
.form-btn {
    display: inline-block;
    width: 80px;
    height: 50px;
    margin-top: 50px;
    background-color: rgb(21,158,142);
    color: #f7fffd;
}
</style>