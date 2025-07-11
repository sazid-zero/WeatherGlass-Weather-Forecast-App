"use client";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
function MenubarMenu(_a) {
    var props = __rest(_a, []);
    return _jsx(MenubarPrimitive.Menu, __assign({}, props));
}
function MenubarGroup(_a) {
    var props = __rest(_a, []);
    return _jsx(MenubarPrimitive.Group, __assign({}, props));
}
function MenubarPortal(_a) {
    var props = __rest(_a, []);
    return _jsx(MenubarPrimitive.Portal, __assign({}, props));
}
function MenubarRadioGroup(_a) {
    var props = __rest(_a, []);
    return _jsx(MenubarPrimitive.RadioGroup, __assign({}, props));
}
function MenubarSub(_a) {
    var props = __rest(_a, []);
    return _jsx(MenubarPrimitive.Sub, __assign({ "data-slot": "menubar-sub" }, props));
}
var Menubar = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (_jsx(MenubarPrimitive.Root, __assign({ ref: ref, className: cn("flex h-10 items-center space-x-1 rounded-md border bg-background p-1", className) }, props)));
});
Menubar.displayName = MenubarPrimitive.Root.displayName;
var MenubarTrigger = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (_jsx(MenubarPrimitive.Trigger, __assign({ ref: ref, className: cn("flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground", className) }, props)));
});
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;
var MenubarSubTrigger = React.forwardRef(function (_a, ref) {
    var className = _a.className, inset = _a.inset, children = _a.children, props = __rest(_a, ["className", "inset", "children"]);
    return (_jsxs(MenubarPrimitive.SubTrigger, __assign({ ref: ref, className: cn("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground", inset && "pl-8", className) }, props, { children: [children, _jsx(ChevronRight, { className: "ml-auto h-4 w-4" })] })));
});
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;
var MenubarSubContent = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (_jsx(MenubarPrimitive.SubContent, __assign({ ref: ref, className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]", className) }, props)));
});
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;
var MenubarContent = React.forwardRef(function (_a, ref) {
    var className = _a.className, _b = _a.align, align = _b === void 0 ? "start" : _b, _c = _a.alignOffset, alignOffset = _c === void 0 ? -4 : _c, _d = _a.sideOffset, sideOffset = _d === void 0 ? 8 : _d, props = __rest(_a, ["className", "align", "alignOffset", "sideOffset"]);
    return (_jsx(MenubarPrimitive.Portal, { children: _jsx(MenubarPrimitive.Content, __assign({ ref: ref, align: align, alignOffset: alignOffset, sideOffset: sideOffset, className: cn("z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]", className) }, props)) }));
});
MenubarContent.displayName = MenubarPrimitive.Content.displayName;
var MenubarItem = React.forwardRef(function (_a, ref) {
    var className = _a.className, inset = _a.inset, props = __rest(_a, ["className", "inset"]);
    return (_jsx(MenubarPrimitive.Item, __assign({ ref: ref, className: cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className) }, props)));
});
MenubarItem.displayName = MenubarPrimitive.Item.displayName;
var MenubarCheckboxItem = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, checked = _a.checked, props = __rest(_a, ["className", "children", "checked"]);
    return (_jsxs(MenubarPrimitive.CheckboxItem, __assign({ ref: ref, className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className), checked: checked }, props, { children: [_jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(MenubarPrimitive.ItemIndicator, { children: _jsx(Check, { className: "h-4 w-4" }) }) }), children] })));
});
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;
var MenubarRadioItem = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (_jsxs(MenubarPrimitive.RadioItem, __assign({ ref: ref, className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className) }, props, { children: [_jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(MenubarPrimitive.ItemIndicator, { children: _jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }), children] })));
});
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;
var MenubarLabel = React.forwardRef(function (_a, ref) {
    var className = _a.className, inset = _a.inset, props = __rest(_a, ["className", "inset"]);
    return (_jsx(MenubarPrimitive.Label, __assign({ ref: ref, className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className) }, props)));
});
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;
var MenubarSeparator = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (_jsx(MenubarPrimitive.Separator, __assign({ ref: ref, className: cn("-mx-1 my-1 h-px bg-muted", className) }, props)));
});
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;
var MenubarShortcut = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (_jsx("span", __assign({ className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className) }, props)));
};
MenubarShortcut.displayname = "MenubarShortcut";
export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarPortal, MenubarSubContent, MenubarSubTrigger, MenubarGroup, MenubarSub, MenubarShortcut, };
