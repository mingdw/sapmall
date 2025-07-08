#!/usr/bin/env python3
"""
Sapphire Mall Favicon Generator
生成项目专用的favicon.ico文件
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_sapphire_favicon():
    """创建蓝宝石主题的favicon"""
    
    # 创建不同尺寸的图标
    sizes = [16, 32, 48, 64]
    images = []
    
    for size in sizes:
        # 创建图像
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # 计算比例
        scale = size / 64.0
        
        # 背景圆形（蓝宝石色渐变效果）
        center = size // 2
        radius = int(30 * scale)
        
        # 创建渐变背景（模拟）
        for i in range(radius):
            alpha = int(255 * (1 - i / radius))
            # 蓝宝石色：从深蓝到浅蓝
            r = int(30 + (96 - 30) * i / radius)   # 1e40af -> 3b82f6
            g = int(64 + (130 - 64) * i / radius)  
            b = int(175 + (246 - 175) * i / radius)
            
            draw.ellipse([center-radius+i, center-radius+i, 
                         center+radius-i, center+radius-i], 
                        fill=(r, g, b, alpha))
        
        # 宝石形状（简化版）
        gem_size = int(12 * scale)
        
        # 宝石顶部
        top_points = [
            (center - gem_size, center - int(4 * scale)),
            (center - int(6 * scale), center - int(8 * scale)),
            (center + int(6 * scale), center - int(8 * scale)),
            (center + gem_size, center - int(4 * scale))
        ]
        draw.polygon(top_points, fill=(219, 234, 254, 200))
        
        # 宝石中部
        mid_points = [
            (center - int(8 * scale), center - int(2 * scale)),
            (center + int(8 * scale), center - int(2 * scale)),
            (center + gem_size, center + int(4 * scale)),
            (center - gem_size, center + int(4 * scale))
        ]
        draw.polygon(mid_points, fill=(147, 197, 253, 180))
        
        # 宝石底部
        bottom_points = [
            (center - gem_size, center + int(4 * scale)),
            (center, center + int(8 * scale)),
            (center + gem_size, center + int(4 * scale))
        ]
        draw.polygon(bottom_points, fill=(59, 130, 246, 160))
        
        # 字母S（如果尺寸足够大）
        if size >= 24:
            try:
                # 尝试使用系统字体
                font_size = max(int(12 * scale), 8)
                font = ImageFont.truetype("arial.ttf", font_size)
            except:
                try:
                    font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
                except:
                    font = ImageFont.load_default()
            
            # 绘制字母S
            text = "S"
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            text_x = center - text_width // 2
            text_y = center - text_height // 2
            
            draw.text((text_x, text_y), text, fill=(30, 64, 175, 200), font=font)
        
        # 装饰星点（仅在较大尺寸时）
        if size >= 32:
            star_size = max(1, int(1 * scale))
            stars = [
                (int(16 * scale), int(20 * scale)),
                (int(48 * scale), int(24 * scale)),
                (int(20 * scale), int(44 * scale)),
                (int(44 * scale), int(48 * scale))
            ]
            
            for sx, sy in stars:
                if 0 <= sx < size and 0 <= sy < size:
                    draw.ellipse([sx-star_size, sy-star_size, 
                                sx+star_size, sy+star_size], 
                               fill=(219, 234, 254, 150))
        
        images.append(img)
    
    return images

def save_favicon():
    """保存favicon文件"""
    try:
        print("🔷 正在生成 Sapphire Mall Favicon...")
        
        # 生成图标
        images = create_sapphire_favicon()
        
        # 保存为ICO文件
        output_path = "design/prototypes/favicon.ico"
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # 保存多尺寸ICO
        images[0].save(output_path, format='ICO', sizes=[(16,16), (32,32), (48,48), (64,64)])
        
        print(f"✅ Favicon 已保存到: {output_path}")
        
        # 保存各种尺寸的PNG文件
        sizes = [16, 32, 48, 64, 180]  # 180 for Apple touch icon
        for i, size in enumerate([16, 32, 48, 64]):
            png_path = f"design/prototypes/favicon-{size}x{size}.png"
            images[i].save(png_path, format='PNG')
            print(f"📱 PNG ({size}x{size}) 已保存到: {png_path}")
        
        # 生成Apple Touch Icon (180x180)
        apple_icon = create_sapphire_favicon()[3].resize((180, 180), Image.Resampling.LANCZOS)
        apple_path = "design/prototypes/apple-touch-icon.png"
        apple_icon.save(apple_path, format='PNG')
        print(f"🍎 Apple Touch Icon 已保存到: {apple_path}")
        
        print("\n🎉 Favicon 生成完成！")
        print("\n📋 使用说明:")
        print("1. 将生成的文件复制到网站根目录")
        print("2. 在HTML的<head>中添加favicon链接")
        print("3. 可以使用 favicon-preview.html 预览效果")
        
    except ImportError:
        print("❌ 错误：需要安装 Pillow 库")
        print("请运行: pip install Pillow")
    except Exception as e:
        print(f"❌ 生成favicon时出错: {e}")

if __name__ == "__main__":
    save_favicon() 