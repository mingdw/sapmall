import * as React from "react"
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd"

// 直接导出Ant Design的Button组件
export const Button = AntButton
export type ButtonProps = AntButtonProps

// 为了兼容性，保留buttonVariants（虽然不使用）
const buttonVariants = () => ""

export { buttonVariants } 