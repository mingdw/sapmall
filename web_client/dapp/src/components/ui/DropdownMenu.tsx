"use client"

import * as React from "react"
import { Dropdown as AntDropdown, DropdownProps as AntDropdownProps } from "antd"
import type { MenuProps } from "antd"

// 直接导出Ant Design的Dropdown组件
export const DropdownMenu = AntDropdown
export type DropdownMenuProps = AntDropdownProps

// 为了保持API兼容性，导出一些常用的子组件
const DropdownMenuTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

const DropdownMenuContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

const DropdownMenuItem = ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li {...props}>{children}</li>
)

const DropdownMenuCheckboxItem = ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li {...props}>{children}</li>
)

const DropdownMenuRadioItem = ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li {...props}>{children}</li>
)

const DropdownMenuLabel = ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li {...props}>{children}</li>
)

const DropdownMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li className={className} {...props} />
)

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={className}
      {...props}
    />
  )
}

const DropdownMenuGroup = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

const DropdownMenuSubContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

const DropdownMenuSubTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

const DropdownMenuRadioGroup = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

export {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} 