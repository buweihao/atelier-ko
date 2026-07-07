import { defineField, defineType } from "sanity";

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "en", title: "English", type: "string" }),
      defineField({ name: "zh", title: "中文", type: "string" }),
    ],
  });

const localizedText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "en", title: "English", type: "text", rows: 4 }),
      defineField({ name: "zh", title: "中文", type: "text", rows: 4 }),
    ],
  });

export const productType = defineType({
  name: "atelierProduct",
  title: "产品",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "产品名称",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    localizedString("nameI18n", "产品名称（多语言）"),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "分类",
      type: "string",
      options: {
        list: ["清洁", "补水", "防晒", "抗衰"],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    localizedString("categoryI18n", "分类（多语言）"),
    defineField({
      name: "collection",
      title: "系列",
      type: "string",
    }),
    localizedString("collectionI18n", "系列（多语言）"),
    defineField({
      name: "shortDescription",
      title: "短描述",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    localizedString("shortDescriptionI18n", "短描述（多语言）"),
    defineField({
      name: "description",
      title: "详情描述",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    localizedText("descriptionI18n", "详情描述（多语言）"),
    defineField({
      name: "price",
      title: "价格",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "material",
      title: "核心成分",
      type: "string",
    }),
    localizedString("materialI18n", "核心成分（多语言）"),
    defineField({
      name: "dimensions",
      title: "规格",
      type: "string",
    }),
    localizedString("dimensionsI18n", "规格（多语言）"),
    defineField({
      name: "finish",
      title: "肤感",
      type: "string",
    }),
    localizedString("finishI18n", "肤感（多语言）"),
    defineField({
      name: "leadTime",
      title: "发货",
      type: "string",
      initialValue: "现货",
    }),
    localizedString("leadTimeI18n", "发货（多语言）"),
    defineField({
      name: "images",
      title: "产品图片",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "order",
      title: "排序",
      type: "number",
      initialValue: 999,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "images.0",
    },
  },
});
