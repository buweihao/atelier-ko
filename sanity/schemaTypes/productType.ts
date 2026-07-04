import { defineField, defineType } from "sanity";

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
    defineField({
      name: "collection",
      title: "系列",
      type: "string",
    }),
    defineField({
      name: "shortDescription",
      title: "短描述",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "description",
      title: "详情描述",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
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
    defineField({
      name: "dimensions",
      title: "规格",
      type: "string",
    }),
    defineField({
      name: "finish",
      title: "肤感",
      type: "string",
    }),
    defineField({
      name: "leadTime",
      title: "发货",
      type: "string",
      initialValue: "现货",
    }),
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
