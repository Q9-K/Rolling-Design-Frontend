<template>
  <div>
    <!-- <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" accept=".png,jpg,.jpeg">
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload> -->

    <el-button ref="buttonRef" v-click-outside="onClickOutside">Click me</el-button>
    <el-popover ref="popoverRef" :virtual-ref="buttonRef" trigger="click" title="With title" virtual-triggering>
      <span> Some content </span>
    </el-popover>

    <el-button ref="buttonRef1" v-click-outside="onClickOutside1">Click me</el-button>
    <el-popover ref="popoverRef1" :virtual-ref="buttonRef1" trigger="click" title="With title" virtual-triggering>
      <span> Some content </span>
    </el-popover>

    <el-button ref="buttonRef2" v-click-outside="onClickOutside2">Click me</el-button>
    <el-popover ref="popoverRef2" :virtual-ref="buttonRef2" trigger="click" title="With title" virtual-triggering>
      <span> Some content </span>
    </el-popover>

    <!-- <span class="rightContent">
      <el-icon ref="projectButtonRef" v-click-outside="projectOut">
        <More />
      </el-icon>
    </span>
    <el-popover ref="projectPopoverOp" :virtual-ref="projectButtonRef" trigger="click" title="With title"
      virtual-triggering>
      <span> Some content </span>
    </el-popover> -->

    <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="nickName" label="昵称" width="180" />
                    <el-table-column prop="name" label="真实姓名" width="180" />
                    <el-table-column prop="email" label="邮箱" />
                    <el-table-column prop="role" label="身份" />
                    <!--如果登录者是创建者-->
                    <!-- <el-table-column prop="op" label="操作">
                    <template #default>
                      <el-button link type="primary" size="small">Detail</el-button>
                      <el-button link type="primary" size="small">Edit</el-button>
                    </template>
                  </el-table-column> -->
                    <el-table-column prop="op" label="操作">
                      <template #default>
                        <el-button link type="primary" size="small">Detail</el-button>
                        <el-button link type="primary" size="small">Detail</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
  </div>
</template>

<script setup>
import { ref, unref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  CaretBottom,
  CaretRight,
  MoreFilled,
  More,
} from '@element-plus/icons-vue'

// import type { UploadProps } from 'element-plus'

const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  // if (popoverRef.value) {
  unref(popoverRef).popperRef?.delayHide?.()
  // }
}

const buttonRef1 = ref()
const popoverRef1 = ref()
const onClickOutside1 = () => {
  // if (popoverRef.value) {
  unref(popoverRef1).popperRef?.delayHide?.()
  // }
}

const buttonRef2 = ref()
const popoverRef2 = ref()
const onClickOutside2 = () => {
  // if (popoverRef.value) {
  unref(popoverRef1).popperRef?.delayHide?.()
  // }
}

const projectButtonRef = ref()
const projectPopoverRef = ref()
const projectOut = () => {
  unref(projectPopoverRef).popperRef?.delayHide?.()
}
//---
const imageUrl = ref('')

/*成功后*/
const handleImageSuccess = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg/png/jpg/gif') {
    ElMessage.error('请上传图像')
    return false
  } else if (rawFile.size / 1024 / 1024 > 8) {
    ElMessage.error('Image size can not exceed 8MB!')
    return false
  }
  return true
}

const tableData = [
  {
    nickName: '哈哈哈哈',
    name: 'Tom',
    email: '11324@qq.com',
    role: '创建者',
    op: '',
  },
  {
    nickName: '哈哈哈哈',
    name: 'Tom',
    email: '11324@qq.com',
    role: '创建者',
    op: '',
  },
]
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>