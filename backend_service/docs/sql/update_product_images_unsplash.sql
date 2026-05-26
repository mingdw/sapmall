-- 商品主图批量更新 — 多源免费样例图（picsum 直链 / loremflickr / pexels / 已验证 unsplash / dummyimage）
-- 会覆盖 example.com、无效 unsplash、picsum seed 等旧链接；保留 sap01 COS 主图
-- 执行: mysql -u user -p saphire_mall < update_product_images_unsplash.sql

START TRANSACTION;

-- id=1 未来城市艺术画作NFT — 保留 COS 图片

-- id=2 抽象几何艺术画作NFT (SPU_ART_PAINT_002)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 2;

-- id=3 赛博朋克艺术画作NFT (SPU_ART_PAINT_003)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/11035371/pexels-photo-11035371.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 3;

-- id=4 波普艺术画作NFT (SPU_ART_PAINT_004)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/1e3a5f/7dd3fc.png&text=SAP+4', updated_at = NOW() WHERE id = 4;

-- id=5 东方水墨艺术画作NFT (SPU_ART_PAINT_005)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/75/800/600.jpg', updated_at = NOW() WHERE id = 5;

-- id=6 电子音乐专辑NFT (SPU_MUSIC_001)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1558655812-973e6220a4b8?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 6;

-- id=7 实验爵士乐NFT (SPU_MUSIC_002)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 7;

-- id=8 环境音乐作品NFT (SPU_MUSIC_003)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+8', updated_at = NOW() WHERE id = 8;

-- id=9 先锋古典音乐NFT (SPU_MUSIC_004)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/50/800/600.jpg', updated_at = NOW() WHERE id = 9;

-- id=10 世界音乐融合NFT (SPU_MUSIC_005)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/20/800/600.jpg', updated_at = NOW() WHERE id = 10;

-- id=11 抽象动态艺术NFT (SPU_VIDEO_ART_001)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/digital,technology/all?lock=5536', updated_at = NOW() WHERE id = 11;

-- id=12 数字生命模拟NFT (SPU_VIDEO_ART_002)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 12;

-- id=13 沉浸式风景NFT (SPU_VIDEO_ART_003)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 13;

-- id=14 数字舞蹈表演NFT (SPU_VIDEO_ART_004)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/4c1d95/f0abfc.png&text=SAP+14', updated_at = NOW() WHERE id = 14;

-- id=15 城市脉动NFT (SPU_VIDEO_ART_005)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/40/800/600.jpg', updated_at = NOW() WHERE id = 15;

-- id=16 数字诗歌集NFT (SPU_TEXT_ART_001)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1561070791-252531792412?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 16;

-- id=17 实验小说NFT (SPU_TEXT_ART_002)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/11035371/pexels-photo-11035371.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 17;

-- id=18 数字剧本NFT (SPU_TEXT_ART_003)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/1e3a5f/7dd3fc.png&text=SAP+18', updated_at = NOW() WHERE id = 18;

-- id=19 概念文本艺术NFT (SPU_TEXT_ART_004)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/45/800/600.jpg', updated_at = NOW() WHERE id = 19;

-- id=20 数字散文集NFT (SPU_TEXT_ART_005)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1558655812-973e6220a4b8?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 20;

-- id=21 未来科技头像NFT (SPU_AVATAR_001)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/90/800/600.jpg', updated_at = NOW() WHERE id = 21;

-- id=22 幻想生物头像NFT (SPU_AVATAR_002)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/portrait,people/all?lock=8541', updated_at = NOW() WHERE id = 22;

-- id=23 抽象艺术头像NFT (SPU_AVATAR_003)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1561070791-252531792412?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 23;

-- id=24 复古像素头像NFT (SPU_AVATAR_004)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 24;

-- id=25 动物拟人头像NFT (SPU_AVATAR_005)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+25', updated_at = NOW() WHERE id = 25;

-- id=26 3D全身虚拟形象NFT (SPU_VIRTUAL_CHAR_001)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/character,cosplay/all?lock=2226', updated_at = NOW() WHERE id = 26;

-- id=27 动漫风格虚拟形象NFT (SPU_VIRTUAL_CHAR_002)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 27;

-- id=28 赛博朋克虚拟形象NFT (SPU_VIRTUAL_CHAR_003)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 28;

-- id=29 奇幻种族虚拟形象NFT (SPU_VIRTUAL_CHAR_004)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/4c1d95/f0abfc.png&text=SAP+29', updated_at = NOW() WHERE id = 29;

-- id=30 未来运动员虚拟形象NFT (SPU_VIRTUAL_CHAR_005)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/character,cosplay/all?lock=2251', updated_at = NOW() WHERE id = 30;

-- id=31 社交媒体身份包NFT (SPU_SOCIAL_ID_001)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 31;

-- id=32 专业创作者身份NFT (SPU_SOCIAL_ID_002)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+32', updated_at = NOW() WHERE id = 32;

-- id=33 游戏玩家身份NFT (SPU_SOCIAL_ID_003)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/35/800/600.jpg', updated_at = NOW() WHERE id = 33;

-- id=34 商业品牌身份NFT (SPU_SOCIAL_ID_004)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/social,network/all?lock=5936', updated_at = NOW() WHERE id = 34;

-- id=35 虚拟影响者身份NFT (SPU_SOCIAL_ID_005)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 35;

-- id=36 传奇武器NFT (SPU_GAME_ITEM_001)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/game,video/all?lock=8911', updated_at = NOW() WHERE id = 36;

-- id=37 稀有防具NFT (SPU_GAME_ITEM_002)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 37;

-- id=38 魔法宠物NFT (SPU_GAME_ITEM_003)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 38;

-- id=39 神秘法术卷轴NFT (SPU_GAME_ITEM_004)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+39', updated_at = NOW() WHERE id = 39;

-- id=40 稀有游戏载具NFT (SPU_GAME_ITEM_005)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/game,video/all?lock=8936', updated_at = NOW() WHERE id = 40;

-- id=41 传奇英雄角色NFT (CQYX_001)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/1e3a5f/7dd3fc.png&text=SAP+41', updated_at = NOW() WHERE id = 41;

-- id=42 稀有怪物角色NFT (XYGWJS_001)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/90/800/600.jpg', updated_at = NOW() WHERE id = 42;

-- id=43 机甲战士角色NFT (JJZS_003)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/fantasy,character/all?lock=6301', updated_at = NOW() WHERE id = 43;

-- id=44 神话生物角色NFT (SHSW_004)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1561070791-252531792412?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 44;

-- id=45 未来战士角色NFT (SPU_GAME_CHAR_005)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 45;

-- id=46 元宇宙黄金地段NFT (SPU_GAME_LAND_001)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 46;

-- id=47 奇幻世界地块NFT (SPU_GAME_LAND_002)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/4c1d95/f0abfc.png&text=SAP+47', updated_at = NOW() WHERE id = 47;

-- id=48 科幻城市地块NFT (SPU_GAME_LAND_003)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/25/800/600.jpg', updated_at = NOW() WHERE id = 48;

-- id=49 海洋世界地块NFT (SPU_GAME_LAND_004)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/space,future/all?lock=7416', updated_at = NOW() WHERE id = 49;

-- id=50 太空基地地块NFT (SPU_GAME_LAND_005)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 50;

-- id=51 传奇武器皮肤NFT (CQWQPF_001)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/45/800/600.jpg', updated_at = NOW() WHERE id = 51;

-- id=52 稀有角色皮肤NFT (SPU_GAME_SKIN_002)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/game,design/all?lock=2716', updated_at = NOW() WHERE id = 52;

-- id=53 限定载具皮肤NFT (XDZJPF_003)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 53;

-- id=54 传说级装备皮肤NFT (CSJZBPF_004)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 54;

-- id=55 科幻宠物皮肤NFT (KHCWPF_005)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+55', updated_at = NOW() WHERE id = 55;

-- id=56 传奇套装NFT (SPU_GAME_EQUIP_001)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+56', updated_at = NOW() WHERE id = 56;

-- id=57 稀有武器NFT (SPU_GAME_EQUIP_002)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/35/800/600.jpg', updated_at = NOW() WHERE id = 57;

-- id=58 神话防具NFT (SPU_GAME_EQUIP_003)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/technology,gaming/all?lock=2656', updated_at = NOW() WHERE id = 58;

-- id=59 科幻装备NFT (SPU_GAME_EQUIP_004)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 59;

-- id=60 元素法器NFT (SPU_GAME_EQUIP_005)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/1e3a5f/7dd3fc.png&text=SAP+60', updated_at = NOW() WHERE id = 60;

-- id=61 传奇龙宠NFT (SPU_GAME_PET_001)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 61;

-- id=62 稀有神兽NFT (SPU_GAME_PET_002)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 62;

-- id=63 机械宠物NFT (SPU_GAME_PET_003)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+63', updated_at = NOW() WHERE id = 63;

-- id=64 元素精灵NFT (SPU_GAME_PET_004)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/80/800/600.jpg', updated_at = NOW() WHERE id = 64;

-- id=65 外星生物NFT (SPU_GAME_PET_005)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/animal,pet/all?lock=6431', updated_at = NOW() WHERE id = 65;

-- id=66 传奇魔法卷轴NFT (SPU_GAME_ITEM_001_N1)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+66', updated_at = NOW() WHERE id = 66;

-- id=67 神秘宝箱NFT (SMBX_002)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/65/800/600.jpg', updated_at = NOW() WHERE id = 67;

-- id=68 魔法药水NFT (MFYS_003)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/game,video/all?lock=9006', updated_at = NOW() WHERE id = 68;

-- id=69 神器碎片NFT (SMSP_004)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1558655812-973e6220a4b8?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 69;

-- id=70 科技装置NFT (KJZZ_005)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/1e3a5f/7dd3fc.png&text=SAP+70', updated_at = NOW() WHERE id = 70;

-- id=71 奇幻城堡NFT (QHCB_001)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+71', updated_at = NOW() WHERE id = 71;

-- id=72 未来城市建筑NFT (WLCSJZ_002)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/20/800/600.jpg', updated_at = NOW() WHERE id = 72;

-- id=73 神秘神殿NFT (SMSD_003)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/architecture,city/all?lock=141', updated_at = NOW() WHERE id = 73;

-- id=74 浮空岛屿NFT (FKDY_004)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1561070791-252531792412?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 74;

-- id=75 古代遗迹NFT (GDYJ_005)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 75;

-- id=76 传奇飞船NFT (SPU_GAME_VEHICLE_001)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/25/800/600.jpg', updated_at = NOW() WHERE id = 76;

-- id=77 战斗机甲NFT (SPU_GAME_VEHICLE_002)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/car,vehicle/all?lock=3826', updated_at = NOW() WHERE id = 77;

-- id=78 奇幻坐骑NFT (SPU_GAME_VEHICLE_003)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 78;

-- id=79 赛车NFT (SPU_GAME_VEHICLE_004)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/11035371/pexels-photo-11035371.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 79;

-- id=80 潜水艇NFT (SPU_GAME_VEHICLE_005)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/50/800/600.jpg', updated_at = NOW() WHERE id = 80;

-- id=81 传奇英雄角色NFT (SPU_GAME_CHAR_001)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 81;

-- id=82 神话生物角色NFT (SPU_GAME_CHAR_002)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+82', updated_at = NOW() WHERE id = 82;

-- id=83 未来战士角色NFT (SPU_GAME_CHAR_003)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/35/800/600.jpg', updated_at = NOW() WHERE id = 83;

-- id=84 魔法师角色NFT (SPU_GAME_CHAR_004)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/fantasy,character/all?lock=6426', updated_at = NOW() WHERE id = 84;

-- id=85 异形生物角色NFT (YXSWJS_005)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 85;

-- id=86 传奇龙宠NFT (CQLQW_001)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/4c1d95/f0abfc.png&text=SAP+86', updated_at = NOW() WHERE id = 86;

-- id=87 神秘精灵宠物NFT (SMJLCW_002)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/55/800/600.jpg', updated_at = NOW() WHERE id = 87;

-- id=88 机械宠物NFT (JXCW_003)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/animal,pet/all?lock=6496', updated_at = NOW() WHERE id = 88;

-- id=89 幻兽宠物NFT (HSCW_004)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 89;

-- id=90 元素精灵宠物NFT (YSJLCW_005)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+90', updated_at = NOW() WHERE id = 90;

-- id=91 传奇武器NFT (CQWQ_001)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 91;

-- id=92 神话防具NFT (SHFJ_002)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+92', updated_at = NOW() WHERE id = 92;

-- id=93 未来科技装备NFT (WLKJZB_003)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/65/800/600.jpg', updated_at = NOW() WHERE id = 93;

-- id=94 魔法饰品NFT (MFSP_004)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/technology,gaming/all?lock=2776', updated_at = NOW() WHERE id = 94;

-- id=95 远古神器NFT (YGSQ_005)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 95;

-- id=96 传奇英雄皮肤NFT (SPU_GAME_SKIN_001)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/4c1d95/f0abfc.png&text=SAP+96', updated_at = NOW() WHERE id = 96;

-- id=97 科幻载具皮肤NFT (KHZJPF_002)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/85/800/600.jpg', updated_at = NOW() WHERE id = 97;

-- id=98 魔法武器皮肤NFT (MFWQPF_003)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/game,design/all?lock=2846', updated_at = NOW() WHERE id = 98;

-- id=99 神话生物皮肤NFT (SHSWPF_004)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1558655812-973e6220a4b8?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 99;

-- id=100 机械装甲皮肤NFT (JXZJPF_005)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/4c1d95/f0abfc.png&text=SAP+100', updated_at = NOW() WHERE id = 100;

-- id=101 传奇魔法卷轴NFT (CQMFJC_001)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/game,video/all?lock=7446', updated_at = NOW() WHERE id = 101;

-- id=102 高级药水NFT (GJYS_003)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1558655812-973e6220a4b8?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 102;

-- id=103 魔法符文NFT (MFFW_004)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/11035371/pexels-photo-11035371.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 103;

-- id=104 传送门道具NFT (CSMDJ_005)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/1e3a5f/7dd3fc.png&text=SAP+104', updated_at = NOW() WHERE id = 104;

-- id=105 高级商务报告Word模板 (SPU_DOC_WORD_001)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/75/800/600.jpg', updated_at = NOW() WHERE id = 105;

-- id=106 财务分析Excel模板套装 (SPU_DOC_EXCEL_001)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/template,design/all?lock=5911', updated_at = NOW() WHERE id = 106;

-- id=107 创意商务PPT模板合集 (SPU_DOC_PPT_001)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/icon,digital/all?lock=8951', updated_at = NOW() WHERE id = 107;

-- id=108 智能PDF表单模板 (SPU_DOC_PDF_001)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1558655812-973e6220a4b8?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 108;

-- id=109 多格式文档模板套装 (SPU_DOC_OTHER_001)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/11035371/pexels-photo-11035371.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 109;

-- id=110 4K科幻风格壁纸合集 (SPU_IMG_WALL_001)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/4c1d95/f0abfc.png&text=SAP+110', updated_at = NOW() WHERE id = 110;

-- id=111 二次元风格头像设计集 (SPU_IMG_AVATAR_001)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/312e81/c4b5fd.png&text=SAP+111', updated_at = NOW() WHERE id = 111;

-- id=112 现代简约商业海报模板 (SPU_IMG_POSTER_001)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/30/800/600.jpg', updated_at = NOW() WHERE id = 112;

-- id=113 手绘风格商业插画集 (SPU_IMG_ILLUST_001)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/70/800/600.jpg', updated_at = NOW() WHERE id = 113;

-- id=114 轻音乐背景音乐合集 (SPU_MUSIC_BGM_001)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/25/800/600.jpg', updated_at = NOW() WHERE id = 114;

-- id=115 电影配乐精选集 (SPU_MUSIC_SCORE_001)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/digital,abstract/all?lock=4311', updated_at = NOW() WHERE id = 115;

-- id=116 现代音乐节拍素材包 (SPU_MUSIC_BEAT_001)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/digital,abstract/all?lock=7351', updated_at = NOW() WHERE id = 116;

-- id=117 自然环境音效合集 (SPU_MUSIC_NATURE_001)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1558655812-973e6220a4b8?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 117;

-- id=118 综合音效素材库 (SPU_MUSIC_OTHER_001)
UPDATE sys_product_spu SET images = 'https://images.unsplash.com/photo-1558655812-973e6220a4b8?auto=format&fit=crop&w=800&q=80', updated_at = NOW() WHERE id = 118;

-- id=119 商业广告视频素材包 (SPU_VIDEO_AD_001)
UPDATE sys_product_spu SET images = 'https://images.pexels.com/photos/11035371/pexels-photo-11035371.jpeg?auto=compress&cs=tinysrgb&w=800', updated_at = NOW() WHERE id = 119;

-- id=120 企业宣传片模板 (SPU_VIDEO_PROMO_001)
UPDATE sys_product_spu SET images = 'https://dummyimage.com/800x600/1e3a5f/7dd3fc.png&text=SAP+120', updated_at = NOW() WHERE id = 120;

-- id=121 在线教育课程模板 (SPU_VIDEO_EDU_001)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/70/800/600.jpg', updated_at = NOW() WHERE id = 121;

-- id=122 MG动画模板套装 (SPU_VIDEO_ANIM_001)
UPDATE sys_product_spu SET images = 'https://picsum.photos/id/20/800/600.jpg', updated_at = NOW() WHERE id = 122;

-- id=123 综合视频素材库 (SPU_VIDEO_OTHER_001)
UPDATE sys_product_spu SET images = 'https://loremflickr.com/800/600/digital,abstract/all?lock=3586', updated_at = NOW() WHERE id = 123;

COMMIT;

-- 共 122 条更新