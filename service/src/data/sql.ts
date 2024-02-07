export const thisVersion = 4

export const cmd: {
    [key: number]: string[]
} = {
    1: [
        `create table api_log
        (
            alid         int auto_increment comment '日志编号'
                primary key,
            uid          int          not null comment '用户 UID',
            time         datetime     null comment '调用时间',
            ip           varchar(999) null comment '调用者 IP',
            \`user-agent\` varchar(999) null comment '调用者 UA',
            iid          int          not null comment '响应图片 IID',
            type         varchar(9)   not null comment '响应类型'
        )
            comment 'API 调用日志';`,
        `
        create table config
        (
          id       int auto_increment comment '配置项目编号'
          primary key,
          \`key\`    varchar(100) not null comment '键',
          value    varchar(999) null comment '值',
          \`update\` datetime     null comment '更新时间',
          editor   varchar(100) null comment '修改者 / 渠道'
            )
          comment '系统配置';
        `,
        `create table images
        (
            iid                 int auto_increment comment '图片 ID'
                primary key,
            source_name         varchar(99)                    not null comment '图片来源',
            source_type         varchar(99) default '人工录入' not null comment '来源类型',
            source_id           varchar(999)                   not null comment '图片来源 ID （如 pixiv PID、Twitter status、群友 QQ 号）',
            source_url          varchar(999)                   null comment '图片来源 url',
            tag                 text                           null comment '人工分类的 tag 标签信息',
            image_age           tinyint                        not null comment '年龄分级类型 （具体见仓库文档）',
            size                int                            not null comment '图片大小（字节）',
            size_type           char                           not null comment '图片尺寸类型（如放大、已压缩、默认，详见文档）',
            x                   varchar(100)                   null comment '图片长度（像素）',
            y                   varchar(100)                   null comment '图片宽度',
            artist_id           varchar(999)                   null comment '画师 ID',
            artist_url          varchar(999)                   null comment '画师 URL',
            artist_name         varchar(999)                   null comment '画师',
            image_tag           varchar(999)                   null comment '画师自己打的 tag',
            image_tag_translate varchar(999)                   null comment '画师自己打的 tag 翻译后',
            image_title         varchar(999)                   null comment '图片标题（画师自己写的标题，和图片名称不同）',
            image_page          varchar(99) default '0'        null comment '图片在专辑内的序号',
            url_public          text                           null comment '公共链接，用于公共调用（如 Onedrive、源地址反代）',
            url_external        text                           null comment '正常登录用户外部链接（如微博、希沃、自建）',
            url_internal        text                           null comment '内部高权限用户（管理员）专用链接（如自建、对象存储）',
            url_backup          text                           null comment '备份链接，仅用于存储（如对象存储、本地硬盘）',
            url_archive         text                           null comment '存档链接，仅用于存档（如互联网档案馆）',
            comments            text                           null comment '其他补充说明'
        )
            comment '图片列表';`,
        `create table login_log
        (
            llid         int auto_increment comment '编号'
                primary key,
            uid          int           not null comment '用户ID',
            time         datetime      not null comment '时间',
            ip           varchar(100)  null comment '用户ip',
            \`user-agent\` varchar(999)  null,
            headers      varchar(9999) null comment '用户请求头'
        )
            comment '登录日志';`,
        `create table permission
        (
            pid     int auto_increment comment '权限编号'
                primary key,
            \`group\` int              not null comment '权限组',
            name    varchar(99)      not null comment '权限节点',
            value   char default '0' not null comment '权限值'
        )
            comment '权限配置';`,
        `create table \`system\`
        (
            id        int auto_increment
                primary key,
            version   int         default 1         not null comment '系统版本',
            dbVersion int         default 1         not null comment '数据库版本',
            \`lock\`    varchar(99) default 'default' not null comment '更新锁'
        )
            comment '系统信息';`,
        `create table user
        (
            uid              int auto_increment comment '用户唯一标识符'
                primary key,
            user             varchar(32)   not null comment '用户账号',
            password         char(32)      not null comment '用户密码 md5',
            permission_group int default 0 not null comment '用户权限组',
            api_time         datetime      null comment '用户上次调用 API 的时间',
            api_img          int           null comment '用户上次调用 API 响应的图片编号',
            \`key\`            char(64)      null comment '用户 KEY 秘钥',
            register_time    datetime      null comment '用户注册时间',
            login_time       datetime      null comment '用户上次登录时间',
            user_agent       varchar(999)  null comment 'UA',
            user_link        varchar(99)   null comment '防盗链'
        )
            comment '用户数据表';`,
        `
        insert into \`system\` (\`version\`, dbVersion, \`lock\`) values (1, 1, 'unlock');
        `
    ],
    2: [`select * from \`system\``],
    3: [
        `alter table user
        add email varchar(99) null comment '邮箱' after login_time;`,
        `alter table user
        add invite_code varchar(99) null comment '注册时使用的邀请码' after email;`,
        `alter table user
        add code varchar(10) null comment '验证码' after email;`,
        `alter table user
        add code_time varchar(99) null comment '上次获取验证码的时间' after code;`,
        `alter table user
        modify user varchar(32) null comment '用户账号';`,
        `alter table user
        modify password char(32) null comment '用户密码 md5';`,
        `alter table user
        modify permission_group int default 0 null comment '用户权限组';`,
        `alter table user
        alter column permission_group set default (-10);`
    ],
    4: [
        `alter table images
        alter column source_name set default 'Pixiv';`,
        `alter table images
        alter column size_type set default 0;`
    ],
    5: [
        `alter table user
        modify uid char(36) not null comment '用户唯一标识符';`,
        `
        alter table api_log
        modify uid char(36) not null comment '用户 UID';
        `,
        `
        alter table login_log
        modify uid char(36) not null comment '用户ID';
        `
    ]
}
