!function (e, t) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).PostNLCard = t();
}(this, function () {
  "use strict";

  const e = new WeakMap(),
        t = t => "function" == typeof t && e.has(t),
        i = void 0 !== window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback,
        n = (e, t, i = null) => {
    for (; t !== i;) {
      const i = t.nextSibling;
      e.removeChild(t), t = i;
    }
  },
        s = {},
        r = {},
        a = `{{lit-${String(Math.random()).slice(2)}}}`,
        o = `\x3c!--${a}--\x3e`,
        d = new RegExp(`${a}|${o}`),
        l = "$lit$";

  class h {
    constructor(e, t) {
      this.parts = [], this.element = t;
      const i = [],
            n = [],
            s = document.createTreeWalker(t.content, 133, null, !1);
      let r = 0,
          o = -1,
          h = 0;
      const {
        strings: c,
        values: {
          length: m
        }
      } = e;

      for (; h < m;) {
        const e = s.nextNode();

        if (null !== e) {
          if (o++, 1 === e.nodeType) {
            if (e.hasAttributes()) {
              const t = e.attributes,
                    {
                length: i
              } = t;
              let n = 0;

              for (let e = 0; e < i; e++) u(t[e].name, l) && n++;

              for (; n-- > 0;) {
                const t = c[h],
                      i = _.exec(t)[2],
                      n = i.toLowerCase() + l,
                      s = e.getAttribute(n);

                e.removeAttribute(n);
                const r = s.split(d);
                this.parts.push({
                  type: "attribute",
                  index: o,
                  name: i,
                  strings: r
                }), h += r.length - 1;
              }
            }

            "TEMPLATE" === e.tagName && (n.push(e), s.currentNode = e.content);
          } else if (3 === e.nodeType) {
            const t = e.data;

            if (t.indexOf(a) >= 0) {
              const n = e.parentNode,
                    s = t.split(d),
                    r = s.length - 1;

              for (let t = 0; t < r; t++) {
                let i,
                    r = s[t];
                if ("" === r) i = f();else {
                  const e = _.exec(r);

                  null !== e && u(e[2], l) && (r = r.slice(0, e.index) + e[1] + e[2].slice(0, -l.length) + e[3]), i = document.createTextNode(r);
                }
                n.insertBefore(i, e), this.parts.push({
                  type: "node",
                  index: ++o
                });
              }

              "" === s[r] ? (n.insertBefore(f(), e), i.push(e)) : e.data = s[r], h += r;
            }
          } else if (8 === e.nodeType) if (e.data === a) {
            const t = e.parentNode;
            null !== e.previousSibling && o !== r || (o++, t.insertBefore(f(), e)), r = o, this.parts.push({
              type: "node",
              index: o
            }), null === e.nextSibling ? e.data = "" : (i.push(e), o--), h++;
          } else {
            let t = -1;

            for (; -1 !== (t = e.data.indexOf(a, t + 1));) this.parts.push({
              type: "node",
              index: -1
            }), h++;
          }
        } else s.currentNode = n.pop();
      }

      for (const e of i) e.parentNode.removeChild(e);
    }

  }

  const u = (e, t) => {
    const i = e.length - t.length;
    return i >= 0 && e.slice(i) === t;
  },
        c = e => -1 !== e.index,
        f = () => document.createComment(""),
        _ = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  class m {
    constructor(e, t, i) {
      this.__parts = [], this.template = e, this.processor = t, this.options = i;
    }

    update(e) {
      let t = 0;

      for (const i of this.__parts) void 0 !== i && i.setValue(e[t]), t++;

      for (const e of this.__parts) void 0 !== e && e.commit();
    }

    _clone() {
      const e = i ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0),
            t = [],
            n = this.template.parts,
            s = document.createTreeWalker(e, 133, null, !1);
      let r,
          a = 0,
          o = 0,
          d = s.nextNode();

      for (; a < n.length;) if (r = n[a], c(r)) {
        for (; o < r.index;) o++, "TEMPLATE" === d.nodeName && (t.push(d), s.currentNode = d.content), null === (d = s.nextNode()) && (s.currentNode = t.pop(), d = s.nextNode());

        if ("node" === r.type) {
          const e = this.processor.handleTextExpression(this.options);
          e.insertAfterNode(d.previousSibling), this.__parts.push(e);
        } else this.__parts.push(...this.processor.handleAttributeExpressions(d, r.name, r.strings, this.options));

        a++;
      } else this.__parts.push(void 0), a++;

      return i && (document.adoptNode(e), customElements.upgrade(e)), e;
    }

  }

  class p {
    constructor(e, t, i, n) {
      this.strings = e, this.values = t, this.type = i, this.processor = n;
    }

    getHTML() {
      const e = this.strings.length - 1;
      let t = "",
          i = !1;

      for (let n = 0; n < e; n++) {
        const e = this.strings[n],
              s = e.lastIndexOf("\x3c!--");
        i = (s > -1 || i) && -1 === e.indexOf("--\x3e", s + 1);

        const r = _.exec(e);

        t += null === r ? e + (i ? a : o) : e.substr(0, r.index) + r[1] + r[2] + l + r[3] + a;
      }

      return t += this.strings[e];
    }

    getTemplateElement() {
      const e = document.createElement("template");
      return e.innerHTML = this.getHTML(), e;
    }

  }

  const y = e => null === e || !("object" == typeof e || "function" == typeof e),
        g = e => Array.isArray(e) || !(!e || !e[Symbol.iterator]);

  class v {
    constructor(e, t, i) {
      this.dirty = !0, this.element = e, this.name = t, this.strings = i, this.parts = [];

      for (let e = 0; e < i.length - 1; e++) this.parts[e] = this._createPart();
    }

    _createPart() {
      return new w(this);
    }

    _getValue() {
      const e = this.strings,
            t = e.length - 1;
      let i = "";

      for (let n = 0; n < t; n++) {
        i += e[n];
        const t = this.parts[n];

        if (void 0 !== t) {
          const e = t.value;
          if (y(e) || !g(e)) i += "string" == typeof e ? e : String(e);else for (const t of e) i += "string" == typeof t ? t : String(t);
        }
      }

      return i += e[t];
    }

    commit() {
      this.dirty && (this.dirty = !1, this.element.setAttribute(this.name, this._getValue()));
    }

  }

  class w {
    constructor(e) {
      this.value = void 0, this.committer = e;
    }

    setValue(e) {
      e === s || y(e) && e === this.value || (this.value = e, t(e) || (this.committer.dirty = !0));
    }

    commit() {
      for (; t(this.value);) {
        const e = this.value;
        this.value = s, e(this);
      }

      this.value !== s && this.committer.commit();
    }

  }

  class S {
    constructor(e) {
      this.value = void 0, this.__pendingValue = void 0, this.options = e;
    }

    appendInto(e) {
      this.startNode = e.appendChild(f()), this.endNode = e.appendChild(f());
    }

    insertAfterNode(e) {
      this.startNode = e, this.endNode = e.nextSibling;
    }

    appendIntoPart(e) {
      e.__insert(this.startNode = f()), e.__insert(this.endNode = f());
    }

    insertAfterPart(e) {
      e.__insert(this.startNode = f()), this.endNode = e.endNode, e.endNode = this.startNode;
    }

    setValue(e) {
      this.__pendingValue = e;
    }

    commit() {
      for (; t(this.__pendingValue);) {
        const e = this.__pendingValue;
        this.__pendingValue = s, e(this);
      }

      const e = this.__pendingValue;
      e !== s && (y(e) ? e !== this.value && this.__commitText(e) : e instanceof p ? this.__commitTemplateResult(e) : e instanceof Node ? this.__commitNode(e) : g(e) ? this.__commitIterable(e) : e === r ? (this.value = r, this.clear()) : this.__commitText(e));
    }

    __insert(e) {
      this.endNode.parentNode.insertBefore(e, this.endNode);
    }

    __commitNode(e) {
      this.value !== e && (this.clear(), this.__insert(e), this.value = e);
    }

    __commitText(e) {
      const t = this.startNode.nextSibling;
      e = null == e ? "" : e, t === this.endNode.previousSibling && 3 === t.nodeType ? t.data = e : this.__commitNode(document.createTextNode("string" == typeof e ? e : String(e))), this.value = e;
    }

    __commitTemplateResult(e) {
      const t = this.options.templateFactory(e);
      if (this.value instanceof m && this.value.template === t) this.value.update(e.values);else {
        const i = new m(t, e.processor, this.options),
              n = i._clone();

        i.update(e.values), this.__commitNode(n), this.value = i;
      }
    }

    __commitIterable(e) {
      Array.isArray(this.value) || (this.value = [], this.clear());
      const t = this.value;
      let i,
          n = 0;

      for (const s of e) void 0 === (i = t[n]) && (i = new S(this.options), t.push(i), 0 === n ? i.appendIntoPart(this) : i.insertAfterPart(t[n - 1])), i.setValue(s), i.commit(), n++;

      n < t.length && (t.length = n, this.clear(i && i.endNode));
    }

    clear(e = this.startNode) {
      n(this.startNode.parentNode, e.nextSibling, this.endNode);
    }

  }

  class b {
    constructor(e, t, i) {
      if (this.value = void 0, this.__pendingValue = void 0, 2 !== i.length || "" !== i[0] || "" !== i[1]) throw new Error("Boolean attributes can only contain a single expression");
      this.element = e, this.name = t, this.strings = i;
    }

    setValue(e) {
      this.__pendingValue = e;
    }

    commit() {
      for (; t(this.__pendingValue);) {
        const e = this.__pendingValue;
        this.__pendingValue = s, e(this);
      }

      if (this.__pendingValue === s) return;
      const e = !!this.__pendingValue;
      this.value !== e && (e ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name), this.value = e), this.__pendingValue = s;
    }

  }

  class k extends v {
    constructor(e, t, i) {
      super(e, t, i), this.single = 2 === i.length && "" === i[0] && "" === i[1];
    }

    _createPart() {
      return new M(this);
    }

    _getValue() {
      return this.single ? this.parts[0].value : super._getValue();
    }

    commit() {
      this.dirty && (this.dirty = !1, this.element[this.name] = this._getValue());
    }

  }

  class M extends w {}

  let D = !1;

  try {
    const e = {
      get capture() {
        return D = !0, !1;
      }

    };
    window.addEventListener("test", e, e), window.removeEventListener("test", e, e);
  } catch (e) {}

  class x {
    constructor(e, t, i) {
      this.value = void 0, this.__pendingValue = void 0, this.element = e, this.eventName = t, this.eventContext = i, this.__boundHandleEvent = e => this.handleEvent(e);
    }

    setValue(e) {
      this.__pendingValue = e;
    }

    commit() {
      for (; t(this.__pendingValue);) {
        const e = this.__pendingValue;
        this.__pendingValue = s, e(this);
      }

      if (this.__pendingValue === s) return;
      const e = this.__pendingValue,
            i = this.value,
            n = null == e || null != i && (e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive),
            r = null != e && (null == i || n);
      n && this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options), r && (this.__options = Y(e), this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)), this.value = e, this.__pendingValue = s;
    }

    handleEvent(e) {
      "function" == typeof this.value ? this.value.call(this.eventContext || this.element, e) : this.value.handleEvent(e);
    }

  }

  const Y = e => e && (D ? {
    capture: e.capture,
    passive: e.passive,
    once: e.once
  } : e.capture);

  const O = new class {
    handleAttributeExpressions(e, t, i, n) {
      const s = t[0];
      return "." === s ? new k(e, t.slice(1), i).parts : "@" === s ? [new x(e, t.slice(1), n.eventContext)] : "?" === s ? [new b(e, t.slice(1), i)] : new v(e, t, i).parts;
    }

    handleTextExpression(e) {
      return new S(e);
    }

  }();

  function T(e) {
    let t = P.get(e.type);
    void 0 === t && (t = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    }, P.set(e.type, t));
    let i = t.stringsArray.get(e.strings);
    if (void 0 !== i) return i;
    const n = e.strings.join(a);
    return void 0 === (i = t.keyString.get(n)) && (i = new h(e, e.getTemplateElement()), t.keyString.set(n, i)), t.stringsArray.set(e.strings, i), i;
  }

  const P = new Map(),
        C = new WeakMap();
  (window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.0.0");

  const N = (e, ...t) => new p(e, t, "html", O),
        j = 133;

  function L(e, t) {
    const {
      element: {
        content: i
      },
      parts: n
    } = e,
          s = document.createTreeWalker(i, j, null, !1);
    let r = W(n),
        a = n[r],
        o = -1,
        d = 0;
    const l = [];
    let h = null;

    for (; s.nextNode();) {
      o++;
      const e = s.currentNode;

      for (e.previousSibling === h && (h = null), t.has(e) && (l.push(e), null === h && (h = e)), null !== h && d++; void 0 !== a && a.index === o;) a.index = null !== h ? -1 : a.index - d, a = n[r = W(n, r)];
    }

    l.forEach(e => e.parentNode.removeChild(e));
  }

  const F = e => {
    let t = 11 === e.nodeType ? 0 : 1;
    const i = document.createTreeWalker(e, j, null, !1);

    for (; i.nextNode();) t++;

    return t;
  },
        W = (e, t = -1) => {
    for (let i = t + 1; i < e.length; i++) {
      const t = e[i];
      if (c(t)) return i;
    }

    return -1;
  };

  const V = (e, t) => `${e}--${t}`;

  let R = !0;
  void 0 === window.ShadyCSS ? R = !1 : void 0 === window.ShadyCSS.prepareTemplateDom && (console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."), R = !1);

  const E = e => t => {
    const i = V(t.type, e);
    let n = P.get(i);
    void 0 === n && (n = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    }, P.set(i, n));
    let s = n.stringsArray.get(t.strings);
    if (void 0 !== s) return s;
    const r = t.strings.join(a);

    if (void 0 === (s = n.keyString.get(r))) {
      const i = t.getTemplateElement();
      R && window.ShadyCSS.prepareTemplateDom(i, e), s = new h(t, i), n.keyString.set(r, s);
    }

    return n.stringsArray.set(t.strings, s), s;
  },
        H = ["html", "svg"],
        A = new Set(),
        U = (e, t, i) => {
    A.add(i);
    const n = e.querySelectorAll("style"),
          {
      length: s
    } = n;
    if (0 === s) return void window.ShadyCSS.prepareTemplateStyles(t.element, i);
    const r = document.createElement("style");

    for (let e = 0; e < s; e++) {
      const t = n[e];
      t.parentNode.removeChild(t), r.textContent += t.textContent;
    }

    (e => {
      H.forEach(t => {
        const i = P.get(V(t, e));
        void 0 !== i && i.keyString.forEach(e => {
          const {
            element: {
              content: t
            }
          } = e,
                i = new Set();
          Array.from(t.querySelectorAll("style")).forEach(e => {
            i.add(e);
          }), L(e, i);
        });
      });
    })(i);

    const a = t.element.content;
    !function (e, t, i = null) {
      const {
        element: {
          content: n
        },
        parts: s
      } = e;
      if (null == i) return void n.appendChild(t);
      const r = document.createTreeWalker(n, j, null, !1);
      let a = W(s),
          o = 0,
          d = -1;

      for (; r.nextNode();) for (d++, r.currentNode === i && (o = F(t), i.parentNode.insertBefore(t, i)); -1 !== a && s[a].index === d;) {
        if (o > 0) {
          for (; -1 !== a;) s[a].index += o, a = W(s, a);

          return;
        }

        a = W(s, a);
      }
    }(t, r, a.firstChild), window.ShadyCSS.prepareTemplateStyles(t.element, i);
    const o = a.querySelector("style");
    if (window.ShadyCSS.nativeShadow && null !== o) e.insertBefore(o.cloneNode(!0), e.firstChild);else {
      a.insertBefore(r, a.firstChild);
      const e = new Set();
      e.add(r), L(t, e);
    }
  };

  window.JSCompiler_renameProperty = (e, t) => e;

  const $ = {
    toAttribute(e, t) {
      switch (t) {
        case Boolean:
          return e ? "" : null;

        case Object:
        case Array:
          return null == e ? e : JSON.stringify(e);
      }

      return e;
    },

    fromAttribute(e, t) {
      switch (t) {
        case Boolean:
          return null !== e;

        case Number:
          return null === e ? null : Number(e);

        case Object:
        case Array:
          return JSON.parse(e);
      }

      return e;
    }

  },
        I = (e, t) => t !== e && (t == t || e == e),
        z = {
    attribute: !0,
    type: String,
    converter: $,
    reflect: !1,
    hasChanged: I
  },
        G = Promise.resolve(!0),
        Z = 1,
        q = 4,
        B = 8,
        J = 16,
        Q = 32;

  class X extends HTMLElement {
    constructor() {
      super(), this._updateState = 0, this._instanceProperties = void 0, this._updatePromise = G, this._hasConnectedResolver = void 0, this._changedProperties = new Map(), this._reflectingProperties = void 0, this.initialize();
    }

    static get observedAttributes() {
      this.finalize();
      const e = [];
      return this._classProperties.forEach((t, i) => {
        const n = this._attributeNameForProperty(i, t);

        void 0 !== n && (this._attributeToPropertyMap.set(n, i), e.push(n));
      }), e;
    }

    static _ensureClassProperties() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties", this))) {
        this._classProperties = new Map();

        const e = Object.getPrototypeOf(this)._classProperties;

        void 0 !== e && e.forEach((e, t) => this._classProperties.set(t, e));
      }
    }

    static createProperty(e, t = z) {
      if (this._ensureClassProperties(), this._classProperties.set(e, t), t.noAccessor || this.prototype.hasOwnProperty(e)) return;
      const i = "symbol" == typeof e ? Symbol() : `__${e}`;
      Object.defineProperty(this.prototype, e, {
        get() {
          return this[i];
        },

        set(t) {
          const n = this[e];
          this[i] = t, this._requestUpdate(e, n);
        },

        configurable: !0,
        enumerable: !0
      });
    }

    static finalize() {
      if (this.hasOwnProperty(JSCompiler_renameProperty("finalized", this)) && this.finalized) return;
      const e = Object.getPrototypeOf(this);

      if ("function" == typeof e.finalize && e.finalize(), this.finalized = !0, this._ensureClassProperties(), this._attributeToPropertyMap = new Map(), this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
        const e = this.properties,
              t = [...Object.getOwnPropertyNames(e), ...("function" == typeof Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(e) : [])];

        for (const i of t) this.createProperty(i, e[i]);
      }
    }

    static _attributeNameForProperty(e, t) {
      const i = t.attribute;
      return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof e ? e.toLowerCase() : void 0;
    }

    static _valueHasChanged(e, t, i = I) {
      return i(e, t);
    }

    static _propertyValueFromAttribute(e, t) {
      const i = t.type,
            n = t.converter || $,
            s = "function" == typeof n ? n : n.fromAttribute;
      return s ? s(e, i) : e;
    }

    static _propertyValueToAttribute(e, t) {
      if (void 0 === t.reflect) return;
      const i = t.type,
            n = t.converter;
      return (n && n.toAttribute || $.toAttribute)(e, i);
    }

    initialize() {
      this._saveInstanceProperties(), this._requestUpdate();
    }

    _saveInstanceProperties() {
      this.constructor._classProperties.forEach((e, t) => {
        if (this.hasOwnProperty(t)) {
          const e = this[t];
          delete this[t], this._instanceProperties || (this._instanceProperties = new Map()), this._instanceProperties.set(t, e);
        }
      });
    }

    _applyInstanceProperties() {
      this._instanceProperties.forEach((e, t) => this[t] = e), this._instanceProperties = void 0;
    }

    connectedCallback() {
      this._updateState = this._updateState | Q, this._hasConnectedResolver && (this._hasConnectedResolver(), this._hasConnectedResolver = void 0);
    }

    disconnectedCallback() {}

    attributeChangedCallback(e, t, i) {
      t !== i && this._attributeToProperty(e, i);
    }

    _propertyToAttribute(e, t, i = z) {
      const n = this.constructor,
            s = n._attributeNameForProperty(e, i);

      if (void 0 !== s) {
        const e = n._propertyValueToAttribute(t, i);

        if (void 0 === e) return;
        this._updateState = this._updateState | B, null == e ? this.removeAttribute(s) : this.setAttribute(s, e), this._updateState = this._updateState & ~B;
      }
    }

    _attributeToProperty(e, t) {
      if (this._updateState & B) return;

      const i = this.constructor,
            n = i._attributeToPropertyMap.get(e);

      if (void 0 !== n) {
        const e = i._classProperties.get(n) || z;
        this._updateState = this._updateState | J, this[n] = i._propertyValueFromAttribute(t, e), this._updateState = this._updateState & ~J;
      }
    }

    _requestUpdate(e, t) {
      let i = !0;

      if (void 0 !== e) {
        const n = this.constructor,
              s = n._classProperties.get(e) || z;
        n._valueHasChanged(this[e], t, s.hasChanged) ? (this._changedProperties.has(e) || this._changedProperties.set(e, t), !0 !== s.reflect || this._updateState & J || (void 0 === this._reflectingProperties && (this._reflectingProperties = new Map()), this._reflectingProperties.set(e, s))) : i = !1;
      }

      !this._hasRequestedUpdate && i && this._enqueueUpdate();
    }

    requestUpdate(e, t) {
      return this._requestUpdate(e, t), this.updateComplete;
    }

    async _enqueueUpdate() {
      let e, t;
      this._updateState = this._updateState | q;
      const i = this._updatePromise;
      this._updatePromise = new Promise((i, n) => {
        e = i, t = n;
      });

      try {
        await i;
      } catch (e) {}

      this._hasConnected || (await new Promise(e => this._hasConnectedResolver = e));

      try {
        const e = this.performUpdate();
        null != e && (await e);
      } catch (e) {
        t(e);
      }

      e(!this._hasRequestedUpdate);
    }

    get _hasConnected() {
      return this._updateState & Q;
    }

    get _hasRequestedUpdate() {
      return this._updateState & q;
    }

    get hasUpdated() {
      return this._updateState & Z;
    }

    performUpdate() {
      this._instanceProperties && this._applyInstanceProperties();
      let e = !1;
      const t = this._changedProperties;

      try {
        (e = this.shouldUpdate(t)) && this.update(t);
      } catch (t) {
        throw e = !1, t;
      } finally {
        this._markUpdated();
      }

      e && (this._updateState & Z || (this._updateState = this._updateState | Z, this.firstUpdated(t)), this.updated(t));
    }

    _markUpdated() {
      this._changedProperties = new Map(), this._updateState = this._updateState & ~q;
    }

    get updateComplete() {
      return this._updatePromise;
    }

    shouldUpdate(e) {
      return !0;
    }

    update(e) {
      void 0 !== this._reflectingProperties && this._reflectingProperties.size > 0 && (this._reflectingProperties.forEach((e, t) => this._propertyToAttribute(t, this[t], e)), this._reflectingProperties = void 0);
    }

    updated(e) {}

    firstUpdated(e) {}

  }

  X.finalized = !0;
  const K = "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  (window.litElementVersions || (window.litElementVersions = [])).push("2.0.1");

  const ee = e => e.flat ? e.flat(1 / 0) : function e(t, i = []) {
    for (let n = 0, s = t.length; n < s; n++) {
      const s = t[n];
      Array.isArray(s) ? e(s, i) : i.push(s);
    }

    return i;
  }(e);

  class te extends X {
    static finalize() {
      super.finalize(), this._styles = this.hasOwnProperty(JSCompiler_renameProperty("styles", this)) ? this._getUniqueStyles() : this._styles || [];
    }

    static _getUniqueStyles() {
      const e = this.styles,
            t = [];

      if (Array.isArray(e)) {
        ee(e).reduceRight((e, t) => (e.add(t), e), new Set()).forEach(e => t.unshift(e));
      } else e && t.push(e);

      return t;
    }

    initialize() {
      super.initialize(), this.renderRoot = this.createRenderRoot(), window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot && this.adoptStyles();
    }

    createRenderRoot() {
      return this.attachShadow({
        mode: "open"
      });
    }

    adoptStyles() {
      const e = this.constructor._styles;
      0 !== e.length && (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow ? K ? this.renderRoot.adoptedStyleSheets = e.map(e => e.styleSheet) : this._needsShimAdoptedStyleSheets = !0 : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e => e.cssText), this.localName));
    }

    connectedCallback() {
      super.connectedCallback(), this.hasUpdated && void 0 !== window.ShadyCSS && window.ShadyCSS.styleElement(this);
    }

    update(e) {
      super.update(e);
      const t = this.render();
      t instanceof p && this.constructor.render(t, this.renderRoot, {
        scopeName: this.localName,
        eventContext: this
      }), this._needsShimAdoptedStyleSheets && (this._needsShimAdoptedStyleSheets = !1, this.constructor._styles.forEach(e => {
        const t = document.createElement("style");
        t.textContent = e.cssText, this.renderRoot.appendChild(t);
      }));
    }

    render() {}

  }

  var ie, ne;

  function se() {
    return ie.apply(null, arguments);
  }

  function re(e) {
    return e instanceof Array || "[object Array]" === Object.prototype.toString.call(e);
  }

  function ae(e) {
    return null != e && "[object Object]" === Object.prototype.toString.call(e);
  }

  function oe(e) {
    return void 0 === e;
  }

  function de(e) {
    return "number" == typeof e || "[object Number]" === Object.prototype.toString.call(e);
  }

  function le(e) {
    return e instanceof Date || "[object Date]" === Object.prototype.toString.call(e);
  }

  function he(e, t) {
    var i,
        n = [];

    for (i = 0; i < e.length; ++i) n.push(t(e[i], i));

    return n;
  }

  function ue(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }

  function ce(e, t) {
    for (var i in t) ue(t, i) && (e[i] = t[i]);

    return ue(t, "toString") && (e.toString = t.toString), ue(t, "valueOf") && (e.valueOf = t.valueOf), e;
  }

  function fe(e, t, i, n) {
    return Pi(e, t, i, n, !0).utc();
  }

  function _e(e) {
    return null == e._pf && (e._pf = {
      empty: !1,
      unusedTokens: [],
      unusedInput: [],
      overflow: -2,
      charsLeftOver: 0,
      nullInput: !1,
      invalidMonth: null,
      invalidFormat: !1,
      userInvalidated: !1,
      iso: !1,
      parsedDateParts: [],
      meridiem: null,
      rfc2822: !1,
      weekdayMismatch: !1
    }), e._pf;
  }

  function me(e) {
    if (null == e._isValid) {
      var t = _e(e),
          i = ne.call(t.parsedDateParts, function (e) {
        return null != e;
      }),
          n = !isNaN(e._d.getTime()) && t.overflow < 0 && !t.empty && !t.invalidMonth && !t.invalidWeekday && !t.weekdayMismatch && !t.nullInput && !t.invalidFormat && !t.userInvalidated && (!t.meridiem || t.meridiem && i);

      if (e._strict && (n = n && 0 === t.charsLeftOver && 0 === t.unusedTokens.length && void 0 === t.bigHour), null != Object.isFrozen && Object.isFrozen(e)) return n;
      e._isValid = n;
    }

    return e._isValid;
  }

  function pe(e) {
    var t = fe(NaN);
    return null != e ? ce(_e(t), e) : _e(t).userInvalidated = !0, t;
  }

  te.finalized = !0, te.render = (e, t, i) => {
    const s = i.scopeName,
          r = C.has(t),
          a = R && 11 === t.nodeType && !!t.host && e instanceof p,
          o = a && !A.has(s),
          d = o ? document.createDocumentFragment() : t;

    if (((e, t, i) => {
      let s = C.get(t);
      void 0 === s && (n(t, t.firstChild), C.set(t, s = new S(Object.assign({
        templateFactory: T
      }, i))), s.appendInto(t)), s.setValue(e), s.commit();
    })(e, d, Object.assign({
      templateFactory: E(s)
    }, i)), o) {
      const e = C.get(d);
      C.delete(d), e.value instanceof m && U(d, e.value.template, s), n(t, t.firstChild), t.appendChild(d), C.set(t, e);
    }

    !r && a && window.ShadyCSS.styleElement(t.host);
  }, ne = Array.prototype.some ? Array.prototype.some : function (e) {
    for (var t = Object(this), i = t.length >>> 0, n = 0; n < i; n++) if (n in t && e.call(this, t[n], n, t)) return !0;

    return !1;
  };
  var ye = se.momentProperties = [];

  function ge(e, t) {
    var i, n, s;
    if (oe(t._isAMomentObject) || (e._isAMomentObject = t._isAMomentObject), oe(t._i) || (e._i = t._i), oe(t._f) || (e._f = t._f), oe(t._l) || (e._l = t._l), oe(t._strict) || (e._strict = t._strict), oe(t._tzm) || (e._tzm = t._tzm), oe(t._isUTC) || (e._isUTC = t._isUTC), oe(t._offset) || (e._offset = t._offset), oe(t._pf) || (e._pf = _e(t)), oe(t._locale) || (e._locale = t._locale), ye.length > 0) for (i = 0; i < ye.length; i++) oe(s = t[n = ye[i]]) || (e[n] = s);
    return e;
  }

  var ve = !1;

  function we(e) {
    ge(this, e), this._d = new Date(null != e._d ? e._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 === ve && (ve = !0, se.updateOffset(this), ve = !1);
  }

  function Se(e) {
    return e instanceof we || null != e && null != e._isAMomentObject;
  }

  function be(e) {
    return e < 0 ? Math.ceil(e) || 0 : Math.floor(e);
  }

  function ke(e) {
    var t = +e,
        i = 0;
    return 0 !== t && isFinite(t) && (i = be(t)), i;
  }

  function Me(e, t, i) {
    var n,
        s = Math.min(e.length, t.length),
        r = Math.abs(e.length - t.length),
        a = 0;

    for (n = 0; n < s; n++) (i && e[n] !== t[n] || !i && ke(e[n]) !== ke(t[n])) && a++;

    return a + r;
  }

  function De(e) {
    !1 === se.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + e);
  }

  function xe(e, t) {
    var i = !0;
    return ce(function () {
      if (null != se.deprecationHandler && se.deprecationHandler(null, e), i) {
        for (var n, s = [], r = 0; r < arguments.length; r++) {
          if (n = "", "object" == typeof arguments[r]) {
            for (var a in n += "\n[" + r + "] ", arguments[0]) n += a + ": " + arguments[0][a] + ", ";

            n = n.slice(0, -2);
          } else n = arguments[r];

          s.push(n);
        }

        De(e + "\nArguments: " + Array.prototype.slice.call(s).join("") + "\n" + new Error().stack), i = !1;
      }

      return t.apply(this, arguments);
    }, t);
  }

  var Ye,
      Oe = {};

  function Te(e, t) {
    null != se.deprecationHandler && se.deprecationHandler(e, t), Oe[e] || (De(t), Oe[e] = !0);
  }

  function Pe(e) {
    return e instanceof Function || "[object Function]" === Object.prototype.toString.call(e);
  }

  function Ce(e, t) {
    var i,
        n = ce({}, e);

    for (i in t) ue(t, i) && (ae(e[i]) && ae(t[i]) ? (n[i] = {}, ce(n[i], e[i]), ce(n[i], t[i])) : null != t[i] ? n[i] = t[i] : delete n[i]);

    for (i in e) ue(e, i) && !ue(t, i) && ae(e[i]) && (n[i] = ce({}, n[i]));

    return n;
  }

  function Ne(e) {
    null != e && this.set(e);
  }

  se.suppressDeprecationWarnings = !1, se.deprecationHandler = null, Ye = Object.keys ? Object.keys : function (e) {
    var t,
        i = [];

    for (t in e) ue(e, t) && i.push(t);

    return i;
  };
  var je = {};

  function Le(e, t) {
    var i = e.toLowerCase();
    je[i] = je[i + "s"] = je[t] = e;
  }

  function Fe(e) {
    return "string" == typeof e ? je[e] || je[e.toLowerCase()] : void 0;
  }

  function We(e) {
    var t,
        i,
        n = {};

    for (i in e) ue(e, i) && (t = Fe(i)) && (n[t] = e[i]);

    return n;
  }

  var Ve = {};

  function Re(e, t) {
    Ve[e] = t;
  }

  function Ee(e, t, i) {
    var n = "" + Math.abs(e),
        s = t - n.length;
    return (e >= 0 ? i ? "+" : "" : "-") + Math.pow(10, Math.max(0, s)).toString().substr(1) + n;
  }

  var He = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
      Ae = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
      Ue = {},
      $e = {};

  function Ie(e, t, i, n) {
    var s = n;
    "string" == typeof n && (s = function () {
      return this[n]();
    }), e && ($e[e] = s), t && ($e[t[0]] = function () {
      return Ee(s.apply(this, arguments), t[1], t[2]);
    }), i && ($e[i] = function () {
      return this.localeData().ordinal(s.apply(this, arguments), e);
    });
  }

  function ze(e, t) {
    return e.isValid() ? (t = Ge(t, e.localeData()), Ue[t] = Ue[t] || function (e) {
      var t,
          i,
          n,
          s = e.match(He);

      for (t = 0, i = s.length; t < i; t++) $e[s[t]] ? s[t] = $e[s[t]] : s[t] = (n = s[t]).match(/\[[\s\S]/) ? n.replace(/^\[|\]$/g, "") : n.replace(/\\/g, "");

      return function (t) {
        var n,
            r = "";

        for (n = 0; n < i; n++) r += Pe(s[n]) ? s[n].call(t, e) : s[n];

        return r;
      };
    }(t), Ue[t](e)) : e.localeData().invalidDate();
  }

  function Ge(e, t) {
    var i = 5;

    function n(e) {
      return t.longDateFormat(e) || e;
    }

    for (Ae.lastIndex = 0; i >= 0 && Ae.test(e);) e = e.replace(Ae, n), Ae.lastIndex = 0, i -= 1;

    return e;
  }

  var Ze = /\d/,
      qe = /\d\d/,
      Be = /\d{3}/,
      Je = /\d{4}/,
      Qe = /[+-]?\d{6}/,
      Xe = /\d\d?/,
      Ke = /\d\d\d\d?/,
      et = /\d\d\d\d\d\d?/,
      tt = /\d{1,3}/,
      it = /\d{1,4}/,
      nt = /[+-]?\d{1,6}/,
      st = /\d+/,
      rt = /[+-]?\d+/,
      at = /Z|[+-]\d\d:?\d\d/gi,
      ot = /Z|[+-]\d\d(?::?\d\d)?/gi,
      dt = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
      lt = {};

  function ht(e, t, i) {
    lt[e] = Pe(t) ? t : function (e, n) {
      return e && i ? i : t;
    };
  }

  function ut(e, t) {
    return ue(lt, e) ? lt[e](t._strict, t._locale) : new RegExp(ct(e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (e, t, i, n, s) {
      return t || i || n || s;
    })));
  }

  function ct(e) {
    return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  var ft = {};

  function _t(e, t) {
    var i,
        n = t;

    for ("string" == typeof e && (e = [e]), de(t) && (n = function (e, i) {
      i[t] = ke(e);
    }), i = 0; i < e.length; i++) ft[e[i]] = n;
  }

  function mt(e, t) {
    _t(e, function (e, i, n, s) {
      n._w = n._w || {}, t(e, n._w, n, s);
    });
  }

  function pt(e, t, i) {
    null != t && ue(ft, e) && ft[e](t, i._a, i, e);
  }

  var yt = 0,
      gt = 1,
      vt = 2,
      wt = 3,
      St = 4,
      bt = 5,
      kt = 6,
      Mt = 7,
      Dt = 8;

  function xt(e) {
    return Yt(e) ? 366 : 365;
  }

  function Yt(e) {
    return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
  }

  Ie("Y", 0, 0, function () {
    var e = this.year();
    return e <= 9999 ? "" + e : "+" + e;
  }), Ie(0, ["YY", 2], 0, function () {
    return this.year() % 100;
  }), Ie(0, ["YYYY", 4], 0, "year"), Ie(0, ["YYYYY", 5], 0, "year"), Ie(0, ["YYYYYY", 6, !0], 0, "year"), Le("year", "y"), Re("year", 1), ht("Y", rt), ht("YY", Xe, qe), ht("YYYY", it, Je), ht("YYYYY", nt, Qe), ht("YYYYYY", nt, Qe), _t(["YYYYY", "YYYYYY"], yt), _t("YYYY", function (e, t) {
    t[yt] = 2 === e.length ? se.parseTwoDigitYear(e) : ke(e);
  }), _t("YY", function (e, t) {
    t[yt] = se.parseTwoDigitYear(e);
  }), _t("Y", function (e, t) {
    t[yt] = parseInt(e, 10);
  }), se.parseTwoDigitYear = function (e) {
    return ke(e) + (ke(e) > 68 ? 1900 : 2e3);
  };
  var Ot,
      Tt = Pt("FullYear", !0);

  function Pt(e, t) {
    return function (i) {
      return null != i ? (Nt(this, e, i), se.updateOffset(this, t), this) : Ct(this, e);
    };
  }

  function Ct(e, t) {
    return e.isValid() ? e._d["get" + (e._isUTC ? "UTC" : "") + t]() : NaN;
  }

  function Nt(e, t, i) {
    e.isValid() && !isNaN(i) && ("FullYear" === t && Yt(e.year()) && 1 === e.month() && 29 === e.date() ? e._d["set" + (e._isUTC ? "UTC" : "") + t](i, e.month(), jt(i, e.month())) : e._d["set" + (e._isUTC ? "UTC" : "") + t](i));
  }

  function jt(e, t) {
    if (isNaN(e) || isNaN(t)) return NaN;
    var i,
        n = (t % (i = 12) + i) % i;
    return e += (t - n) / 12, 1 === n ? Yt(e) ? 29 : 28 : 31 - n % 7 % 2;
  }

  Ot = Array.prototype.indexOf ? Array.prototype.indexOf : function (e) {
    var t;

    for (t = 0; t < this.length; ++t) if (this[t] === e) return t;

    return -1;
  }, Ie("M", ["MM", 2], "Mo", function () {
    return this.month() + 1;
  }), Ie("MMM", 0, 0, function (e) {
    return this.localeData().monthsShort(this, e);
  }), Ie("MMMM", 0, 0, function (e) {
    return this.localeData().months(this, e);
  }), Le("month", "M"), Re("month", 8), ht("M", Xe), ht("MM", Xe, qe), ht("MMM", function (e, t) {
    return t.monthsShortRegex(e);
  }), ht("MMMM", function (e, t) {
    return t.monthsRegex(e);
  }), _t(["M", "MM"], function (e, t) {
    t[gt] = ke(e) - 1;
  }), _t(["MMM", "MMMM"], function (e, t, i, n) {
    var s = i._locale.monthsParse(e, n, i._strict);

    null != s ? t[gt] = s : _e(i).invalidMonth = e;
  });
  var Lt = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
      Ft = "January_February_March_April_May_June_July_August_September_October_November_December".split("_");
  var Wt = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");

  function Vt(e, t) {
    var i;
    if (!e.isValid()) return e;
    if ("string" == typeof t) if (/^\d+$/.test(t)) t = ke(t);else if (!de(t = e.localeData().monthsParse(t))) return e;
    return i = Math.min(e.date(), jt(e.year(), t)), e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, i), e;
  }

  function Rt(e) {
    return null != e ? (Vt(this, e), se.updateOffset(this, !0), this) : Ct(this, "Month");
  }

  var Et = dt;
  var Ht = dt;

  function At() {
    function e(e, t) {
      return t.length - e.length;
    }

    var t,
        i,
        n = [],
        s = [],
        r = [];

    for (t = 0; t < 12; t++) i = fe([2e3, t]), n.push(this.monthsShort(i, "")), s.push(this.months(i, "")), r.push(this.months(i, "")), r.push(this.monthsShort(i, ""));

    for (n.sort(e), s.sort(e), r.sort(e), t = 0; t < 12; t++) n[t] = ct(n[t]), s[t] = ct(s[t]);

    for (t = 0; t < 24; t++) r[t] = ct(r[t]);

    this._monthsRegex = new RegExp("^(" + r.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = new RegExp("^(" + s.join("|") + ")", "i"), this._monthsShortStrictRegex = new RegExp("^(" + n.join("|") + ")", "i");
  }

  function Ut(e) {
    var t;

    if (e < 100 && e >= 0) {
      var i = Array.prototype.slice.call(arguments);
      i[0] = e + 400, t = new Date(Date.UTC.apply(null, i)), isFinite(t.getUTCFullYear()) && t.setUTCFullYear(e);
    } else t = new Date(Date.UTC.apply(null, arguments));

    return t;
  }

  function $t(e, t, i) {
    var n = 7 + t - i;
    return -((7 + Ut(e, 0, n).getUTCDay() - t) % 7) + n - 1;
  }

  function It(e, t, i, n, s) {
    var r,
        a,
        o = 1 + 7 * (t - 1) + (7 + i - n) % 7 + $t(e, n, s);
    return o <= 0 ? a = xt(r = e - 1) + o : o > xt(e) ? (r = e + 1, a = o - xt(e)) : (r = e, a = o), {
      year: r,
      dayOfYear: a
    };
  }

  function zt(e, t, i) {
    var n,
        s,
        r = $t(e.year(), t, i),
        a = Math.floor((e.dayOfYear() - r - 1) / 7) + 1;
    return a < 1 ? n = a + Gt(s = e.year() - 1, t, i) : a > Gt(e.year(), t, i) ? (n = a - Gt(e.year(), t, i), s = e.year() + 1) : (s = e.year(), n = a), {
      week: n,
      year: s
    };
  }

  function Gt(e, t, i) {
    var n = $t(e, t, i),
        s = $t(e + 1, t, i);
    return (xt(e) - n + s) / 7;
  }

  Ie("w", ["ww", 2], "wo", "week"), Ie("W", ["WW", 2], "Wo", "isoWeek"), Le("week", "w"), Le("isoWeek", "W"), Re("week", 5), Re("isoWeek", 5), ht("w", Xe), ht("ww", Xe, qe), ht("W", Xe), ht("WW", Xe, qe), mt(["w", "ww", "W", "WW"], function (e, t, i, n) {
    t[n.substr(0, 1)] = ke(e);
  });

  function Zt(e, t) {
    return e.slice(t, 7).concat(e.slice(0, t));
  }

  Ie("d", 0, "do", "day"), Ie("dd", 0, 0, function (e) {
    return this.localeData().weekdaysMin(this, e);
  }), Ie("ddd", 0, 0, function (e) {
    return this.localeData().weekdaysShort(this, e);
  }), Ie("dddd", 0, 0, function (e) {
    return this.localeData().weekdays(this, e);
  }), Ie("e", 0, 0, "weekday"), Ie("E", 0, 0, "isoWeekday"), Le("day", "d"), Le("weekday", "e"), Le("isoWeekday", "E"), Re("day", 11), Re("weekday", 11), Re("isoWeekday", 11), ht("d", Xe), ht("e", Xe), ht("E", Xe), ht("dd", function (e, t) {
    return t.weekdaysMinRegex(e);
  }), ht("ddd", function (e, t) {
    return t.weekdaysShortRegex(e);
  }), ht("dddd", function (e, t) {
    return t.weekdaysRegex(e);
  }), mt(["dd", "ddd", "dddd"], function (e, t, i, n) {
    var s = i._locale.weekdaysParse(e, n, i._strict);

    null != s ? t.d = s : _e(i).invalidWeekday = e;
  }), mt(["d", "e", "E"], function (e, t, i, n) {
    t[n] = ke(e);
  });
  var qt = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_");
  var Bt = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_");
  var Jt = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
  var Qt = dt;
  var Xt = dt;
  var Kt = dt;

  function ei() {
    function e(e, t) {
      return t.length - e.length;
    }

    var t,
        i,
        n,
        s,
        r,
        a = [],
        o = [],
        d = [],
        l = [];

    for (t = 0; t < 7; t++) i = fe([2e3, 1]).day(t), n = this.weekdaysMin(i, ""), s = this.weekdaysShort(i, ""), r = this.weekdays(i, ""), a.push(n), o.push(s), d.push(r), l.push(n), l.push(s), l.push(r);

    for (a.sort(e), o.sort(e), d.sort(e), l.sort(e), t = 0; t < 7; t++) o[t] = ct(o[t]), d[t] = ct(d[t]), l[t] = ct(l[t]);

    this._weekdaysRegex = new RegExp("^(" + l.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp("^(" + d.join("|") + ")", "i"), this._weekdaysShortStrictRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._weekdaysMinStrictRegex = new RegExp("^(" + a.join("|") + ")", "i");
  }

  function ti() {
    return this.hours() % 12 || 12;
  }

  function ii(e, t) {
    Ie(e, 0, 0, function () {
      return this.localeData().meridiem(this.hours(), this.minutes(), t);
    });
  }

  function ni(e, t) {
    return t._meridiemParse;
  }

  Ie("H", ["HH", 2], 0, "hour"), Ie("h", ["hh", 2], 0, ti), Ie("k", ["kk", 2], 0, function () {
    return this.hours() || 24;
  }), Ie("hmm", 0, 0, function () {
    return "" + ti.apply(this) + Ee(this.minutes(), 2);
  }), Ie("hmmss", 0, 0, function () {
    return "" + ti.apply(this) + Ee(this.minutes(), 2) + Ee(this.seconds(), 2);
  }), Ie("Hmm", 0, 0, function () {
    return "" + this.hours() + Ee(this.minutes(), 2);
  }), Ie("Hmmss", 0, 0, function () {
    return "" + this.hours() + Ee(this.minutes(), 2) + Ee(this.seconds(), 2);
  }), ii("a", !0), ii("A", !1), Le("hour", "h"), Re("hour", 13), ht("a", ni), ht("A", ni), ht("H", Xe), ht("h", Xe), ht("k", Xe), ht("HH", Xe, qe), ht("hh", Xe, qe), ht("kk", Xe, qe), ht("hmm", Ke), ht("hmmss", et), ht("Hmm", Ke), ht("Hmmss", et), _t(["H", "HH"], wt), _t(["k", "kk"], function (e, t, i) {
    var n = ke(e);
    t[wt] = 24 === n ? 0 : n;
  }), _t(["a", "A"], function (e, t, i) {
    i._isPm = i._locale.isPM(e), i._meridiem = e;
  }), _t(["h", "hh"], function (e, t, i) {
    t[wt] = ke(e), _e(i).bigHour = !0;
  }), _t("hmm", function (e, t, i) {
    var n = e.length - 2;
    t[wt] = ke(e.substr(0, n)), t[St] = ke(e.substr(n)), _e(i).bigHour = !0;
  }), _t("hmmss", function (e, t, i) {
    var n = e.length - 4,
        s = e.length - 2;
    t[wt] = ke(e.substr(0, n)), t[St] = ke(e.substr(n, 2)), t[bt] = ke(e.substr(s)), _e(i).bigHour = !0;
  }), _t("Hmm", function (e, t, i) {
    var n = e.length - 2;
    t[wt] = ke(e.substr(0, n)), t[St] = ke(e.substr(n));
  }), _t("Hmmss", function (e, t, i) {
    var n = e.length - 4,
        s = e.length - 2;
    t[wt] = ke(e.substr(0, n)), t[St] = ke(e.substr(n, 2)), t[bt] = ke(e.substr(s));
  });
  var si,
      ri = Pt("Hours", !0),
      ai = {
    calendar: {
      sameDay: "[Today at] LT",
      nextDay: "[Tomorrow at] LT",
      nextWeek: "dddd [at] LT",
      lastDay: "[Yesterday at] LT",
      lastWeek: "[Last] dddd [at] LT",
      sameElse: "L"
    },
    longDateFormat: {
      LTS: "h:mm:ss A",
      LT: "h:mm A",
      L: "MM/DD/YYYY",
      LL: "MMMM D, YYYY",
      LLL: "MMMM D, YYYY h:mm A",
      LLLL: "dddd, MMMM D, YYYY h:mm A"
    },
    invalidDate: "Invalid date",
    ordinal: "%d",
    dayOfMonthOrdinalParse: /\d{1,2}/,
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "a few seconds",
      ss: "%d seconds",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years"
    },
    months: Ft,
    monthsShort: Wt,
    week: {
      dow: 0,
      doy: 6
    },
    weekdays: qt,
    weekdaysMin: Jt,
    weekdaysShort: Bt,
    meridiemParse: /[ap]\.?m?\.?/i
  },
      oi = {},
      di = {};

  function li(e) {
    return e ? e.toLowerCase().replace("_", "-") : e;
  }

  function hi(e) {
    var t = null;
    if (!oi[e] && "undefined" != typeof module && module && module.exports) try {
      t = si._abbr, require("./locale/" + e), ui(t);
    } catch (e) {}
    return oi[e];
  }

  function ui(e, t) {
    var i;
    return e && ((i = oe(t) ? fi(e) : ci(e, t)) ? si = i : "undefined" != typeof console && console.warn && console.warn("Locale " + e + " not found. Did you forget to load it?")), si._abbr;
  }

  function ci(e, t) {
    if (null !== t) {
      var i,
          n = ai;
      if (t.abbr = e, null != oi[e]) Te("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), n = oi[e]._config;else if (null != t.parentLocale) if (null != oi[t.parentLocale]) n = oi[t.parentLocale]._config;else {
        if (null == (i = hi(t.parentLocale))) return di[t.parentLocale] || (di[t.parentLocale] = []), di[t.parentLocale].push({
          name: e,
          config: t
        }), null;
        n = i._config;
      }
      return oi[e] = new Ne(Ce(n, t)), di[e] && di[e].forEach(function (e) {
        ci(e.name, e.config);
      }), ui(e), oi[e];
    }

    return delete oi[e], null;
  }

  function fi(e) {
    var t;
    if (e && e._locale && e._locale._abbr && (e = e._locale._abbr), !e) return si;

    if (!re(e)) {
      if (t = hi(e)) return t;
      e = [e];
    }

    return function (e) {
      for (var t, i, n, s, r = 0; r < e.length;) {
        for (t = (s = li(e[r]).split("-")).length, i = (i = li(e[r + 1])) ? i.split("-") : null; t > 0;) {
          if (n = hi(s.slice(0, t).join("-"))) return n;
          if (i && i.length >= t && Me(s, i, !0) >= t - 1) break;
          t--;
        }

        r++;
      }

      return si;
    }(e);
  }

  function _i(e) {
    var t,
        i = e._a;
    return i && -2 === _e(e).overflow && (t = i[gt] < 0 || i[gt] > 11 ? gt : i[vt] < 1 || i[vt] > jt(i[yt], i[gt]) ? vt : i[wt] < 0 || i[wt] > 24 || 24 === i[wt] && (0 !== i[St] || 0 !== i[bt] || 0 !== i[kt]) ? wt : i[St] < 0 || i[St] > 59 ? St : i[bt] < 0 || i[bt] > 59 ? bt : i[kt] < 0 || i[kt] > 999 ? kt : -1, _e(e)._overflowDayOfYear && (t < yt || t > vt) && (t = vt), _e(e)._overflowWeeks && -1 === t && (t = Mt), _e(e)._overflowWeekday && -1 === t && (t = Dt), _e(e).overflow = t), e;
  }

  function mi(e, t, i) {
    return null != e ? e : null != t ? t : i;
  }

  function pi(e) {
    var t,
        i,
        n,
        s,
        r,
        a = [];

    if (!e._d) {
      for (n = function (e) {
        var t = new Date(se.now());
        return e._useUTC ? [t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()] : [t.getFullYear(), t.getMonth(), t.getDate()];
      }(e), e._w && null == e._a[vt] && null == e._a[gt] && function (e) {
        var t, i, n, s, r, a, o, d;
        if (null != (t = e._w).GG || null != t.W || null != t.E) r = 1, a = 4, i = mi(t.GG, e._a[yt], zt(Ci(), 1, 4).year), n = mi(t.W, 1), ((s = mi(t.E, 1)) < 1 || s > 7) && (d = !0);else {
          r = e._locale._week.dow, a = e._locale._week.doy;
          var l = zt(Ci(), r, a);
          i = mi(t.gg, e._a[yt], l.year), n = mi(t.w, l.week), null != t.d ? ((s = t.d) < 0 || s > 6) && (d = !0) : null != t.e ? (s = t.e + r, (t.e < 0 || t.e > 6) && (d = !0)) : s = r;
        }
        n < 1 || n > Gt(i, r, a) ? _e(e)._overflowWeeks = !0 : null != d ? _e(e)._overflowWeekday = !0 : (o = It(i, n, s, r, a), e._a[yt] = o.year, e._dayOfYear = o.dayOfYear);
      }(e), null != e._dayOfYear && (r = mi(e._a[yt], n[yt]), (e._dayOfYear > xt(r) || 0 === e._dayOfYear) && (_e(e)._overflowDayOfYear = !0), i = Ut(r, 0, e._dayOfYear), e._a[gt] = i.getUTCMonth(), e._a[vt] = i.getUTCDate()), t = 0; t < 3 && null == e._a[t]; ++t) e._a[t] = a[t] = n[t];

      for (; t < 7; t++) e._a[t] = a[t] = null == e._a[t] ? 2 === t ? 1 : 0 : e._a[t];

      24 === e._a[wt] && 0 === e._a[St] && 0 === e._a[bt] && 0 === e._a[kt] && (e._nextDay = !0, e._a[wt] = 0), e._d = (e._useUTC ? Ut : function (e, t, i, n, s, r, a) {
        var o;
        return e < 100 && e >= 0 ? (o = new Date(e + 400, t, i, n, s, r, a), isFinite(o.getFullYear()) && o.setFullYear(e)) : o = new Date(e, t, i, n, s, r, a), o;
      }).apply(null, a), s = e._useUTC ? e._d.getUTCDay() : e._d.getDay(), null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), e._nextDay && (e._a[wt] = 24), e._w && void 0 !== e._w.d && e._w.d !== s && (_e(e).weekdayMismatch = !0);
    }
  }

  var yi = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
      gi = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
      vi = /Z|[+-]\d\d(?::?\d\d)?/,
      wi = [["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/], ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/], ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/], ["GGGG-[W]WW", /\d{4}-W\d\d/, !1], ["YYYY-DDD", /\d{4}-\d{3}/], ["YYYY-MM", /\d{4}-\d\d/, !1], ["YYYYYYMMDD", /[+-]\d{10}/], ["YYYYMMDD", /\d{8}/], ["GGGG[W]WWE", /\d{4}W\d{3}/], ["GGGG[W]WW", /\d{4}W\d{2}/, !1], ["YYYYDDD", /\d{7}/]],
      Si = [["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/], ["HH:mm:ss", /\d\d:\d\d:\d\d/], ["HH:mm", /\d\d:\d\d/], ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/], ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/], ["HHmmss", /\d\d\d\d\d\d/], ["HHmm", /\d\d\d\d/], ["HH", /\d\d/]],
      bi = /^\/?Date\((\-?\d+)/i;

  function ki(e) {
    var t,
        i,
        n,
        s,
        r,
        a,
        o = e._i,
        d = yi.exec(o) || gi.exec(o);

    if (d) {
      for (_e(e).iso = !0, t = 0, i = wi.length; t < i; t++) if (wi[t][1].exec(d[1])) {
        s = wi[t][0], n = !1 !== wi[t][2];
        break;
      }

      if (null == s) return void (e._isValid = !1);

      if (d[3]) {
        for (t = 0, i = Si.length; t < i; t++) if (Si[t][1].exec(d[3])) {
          r = (d[2] || " ") + Si[t][0];
          break;
        }

        if (null == r) return void (e._isValid = !1);
      }

      if (!n && null != r) return void (e._isValid = !1);

      if (d[4]) {
        if (!vi.exec(d[4])) return void (e._isValid = !1);
        a = "Z";
      }

      e._f = s + (r || "") + (a || ""), Oi(e);
    } else e._isValid = !1;
  }

  var Mi = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

  function Di(e) {
    var t = parseInt(e, 10);
    return t <= 49 ? 2e3 + t : t <= 999 ? 1900 + t : t;
  }

  var xi = {
    UT: 0,
    GMT: 0,
    EDT: -240,
    EST: -300,
    CDT: -300,
    CST: -360,
    MDT: -360,
    MST: -420,
    PDT: -420,
    PST: -480
  };

  function Yi(e) {
    var t,
        i,
        n,
        s,
        r,
        a,
        o,
        d = Mi.exec(e._i.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, ""));

    if (d) {
      var l = (t = d[4], i = d[3], n = d[2], s = d[5], r = d[6], a = d[7], o = [Di(t), Wt.indexOf(i), parseInt(n, 10), parseInt(s, 10), parseInt(r, 10)], a && o.push(parseInt(a, 10)), o);
      if (!function (e, t, i) {
        return !e || Bt.indexOf(e) === new Date(t[0], t[1], t[2]).getDay() || (_e(i).weekdayMismatch = !0, i._isValid = !1, !1);
      }(d[1], l, e)) return;
      e._a = l, e._tzm = function (e, t, i) {
        if (e) return xi[e];
        if (t) return 0;
        var n = parseInt(i, 10),
            s = n % 100;
        return (n - s) / 100 * 60 + s;
      }(d[8], d[9], d[10]), e._d = Ut.apply(null, e._a), e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), _e(e).rfc2822 = !0;
    } else e._isValid = !1;
  }

  function Oi(e) {
    if (e._f !== se.ISO_8601) {
      if (e._f !== se.RFC_2822) {
        e._a = [], _e(e).empty = !0;
        var t,
            i,
            n,
            s,
            r,
            a = "" + e._i,
            o = a.length,
            d = 0;

        for (n = Ge(e._f, e._locale).match(He) || [], t = 0; t < n.length; t++) s = n[t], (i = (a.match(ut(s, e)) || [])[0]) && ((r = a.substr(0, a.indexOf(i))).length > 0 && _e(e).unusedInput.push(r), a = a.slice(a.indexOf(i) + i.length), d += i.length), $e[s] ? (i ? _e(e).empty = !1 : _e(e).unusedTokens.push(s), pt(s, i, e)) : e._strict && !i && _e(e).unusedTokens.push(s);

        _e(e).charsLeftOver = o - d, a.length > 0 && _e(e).unusedInput.push(a), e._a[wt] <= 12 && !0 === _e(e).bigHour && e._a[wt] > 0 && (_e(e).bigHour = void 0), _e(e).parsedDateParts = e._a.slice(0), _e(e).meridiem = e._meridiem, e._a[wt] = function (e, t, i) {
          var n;
          if (null == i) return t;
          return null != e.meridiemHour ? e.meridiemHour(t, i) : null != e.isPM ? ((n = e.isPM(i)) && t < 12 && (t += 12), n || 12 !== t || (t = 0), t) : t;
        }(e._locale, e._a[wt], e._meridiem), pi(e), _i(e);
      } else Yi(e);
    } else ki(e);
  }

  function Ti(e) {
    var t = e._i,
        i = e._f;
    return e._locale = e._locale || fi(e._l), null === t || void 0 === i && "" === t ? pe({
      nullInput: !0
    }) : ("string" == typeof t && (e._i = t = e._locale.preparse(t)), Se(t) ? new we(_i(t)) : (le(t) ? e._d = t : re(i) ? function (e) {
      var t, i, n, s, r;
      if (0 === e._f.length) return _e(e).invalidFormat = !0, void (e._d = new Date(NaN));

      for (s = 0; s < e._f.length; s++) r = 0, t = ge({}, e), null != e._useUTC && (t._useUTC = e._useUTC), t._f = e._f[s], Oi(t), me(t) && (r += _e(t).charsLeftOver, r += 10 * _e(t).unusedTokens.length, _e(t).score = r, (null == n || r < n) && (n = r, i = t));

      ce(e, i || t);
    }(e) : i ? Oi(e) : function (e) {
      var t = e._i;
      oe(t) ? e._d = new Date(se.now()) : le(t) ? e._d = new Date(t.valueOf()) : "string" == typeof t ? function (e) {
        var t = bi.exec(e._i);
        null === t ? (ki(e), !1 === e._isValid && (delete e._isValid, Yi(e), !1 === e._isValid && (delete e._isValid, se.createFromInputFallback(e)))) : e._d = new Date(+t[1]);
      }(e) : re(t) ? (e._a = he(t.slice(0), function (e) {
        return parseInt(e, 10);
      }), pi(e)) : ae(t) ? function (e) {
        if (!e._d) {
          var t = We(e._i);
          e._a = he([t.year, t.month, t.day || t.date, t.hour, t.minute, t.second, t.millisecond], function (e) {
            return e && parseInt(e, 10);
          }), pi(e);
        }
      }(e) : de(t) ? e._d = new Date(t) : se.createFromInputFallback(e);
    }(e), me(e) || (e._d = null), e));
  }

  function Pi(e, t, i, n, s) {
    var r,
        a = {};
    return !0 !== i && !1 !== i || (n = i, i = void 0), (ae(e) && function (e) {
      if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(e).length;
      var t;

      for (t in e) if (e.hasOwnProperty(t)) return !1;

      return !0;
    }(e) || re(e) && 0 === e.length) && (e = void 0), a._isAMomentObject = !0, a._useUTC = a._isUTC = s, a._l = i, a._i = e, a._f = t, a._strict = n, (r = new we(_i(Ti(a))))._nextDay && (r.add(1, "d"), r._nextDay = void 0), r;
  }

  function Ci(e, t, i, n) {
    return Pi(e, t, i, n, !1);
  }

  se.createFromInputFallback = xe("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function (e) {
    e._d = new Date(e._i + (e._useUTC ? " UTC" : ""));
  }), se.ISO_8601 = function () {}, se.RFC_2822 = function () {};
  var Ni = xe("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
    var e = Ci.apply(null, arguments);
    return this.isValid() && e.isValid() ? e < this ? this : e : pe();
  }),
      ji = xe("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
    var e = Ci.apply(null, arguments);
    return this.isValid() && e.isValid() ? e > this ? this : e : pe();
  });

  function Li(e, t) {
    var i, n;
    if (1 === t.length && re(t[0]) && (t = t[0]), !t.length) return Ci();

    for (i = t[0], n = 1; n < t.length; ++n) t[n].isValid() && !t[n][e](i) || (i = t[n]);

    return i;
  }

  var Fi = ["year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond"];

  function Wi(e) {
    var t = We(e),
        i = t.year || 0,
        n = t.quarter || 0,
        s = t.month || 0,
        r = t.week || t.isoWeek || 0,
        a = t.day || 0,
        o = t.hour || 0,
        d = t.minute || 0,
        l = t.second || 0,
        h = t.millisecond || 0;
    this._isValid = function (e) {
      for (var t in e) if (-1 === Ot.call(Fi, t) || null != e[t] && isNaN(e[t])) return !1;

      for (var i = !1, n = 0; n < Fi.length; ++n) if (e[Fi[n]]) {
        if (i) return !1;
        parseFloat(e[Fi[n]]) !== ke(e[Fi[n]]) && (i = !0);
      }

      return !0;
    }(t), this._milliseconds = +h + 1e3 * l + 6e4 * d + 1e3 * o * 60 * 60, this._days = +a + 7 * r, this._months = +s + 3 * n + 12 * i, this._data = {}, this._locale = fi(), this._bubble();
  }

  function Vi(e) {
    return e instanceof Wi;
  }

  function Ri(e) {
    return e < 0 ? -1 * Math.round(-1 * e) : Math.round(e);
  }

  function Ei(e, t) {
    Ie(e, 0, 0, function () {
      var e = this.utcOffset(),
          i = "+";
      return e < 0 && (e = -e, i = "-"), i + Ee(~~(e / 60), 2) + t + Ee(~~e % 60, 2);
    });
  }

  Ei("Z", ":"), Ei("ZZ", ""), ht("Z", ot), ht("ZZ", ot), _t(["Z", "ZZ"], function (e, t, i) {
    i._useUTC = !0, i._tzm = Ai(ot, e);
  });
  var Hi = /([\+\-]|\d\d)/gi;

  function Ai(e, t) {
    var i = (t || "").match(e);
    if (null === i) return null;
    var n = ((i[i.length - 1] || []) + "").match(Hi) || ["-", 0, 0],
        s = 60 * n[1] + ke(n[2]);
    return 0 === s ? 0 : "+" === n[0] ? s : -s;
  }

  function Ui(e, t) {
    var i, n;
    return t._isUTC ? (i = t.clone(), n = (Se(e) || le(e) ? e.valueOf() : Ci(e).valueOf()) - i.valueOf(), i._d.setTime(i._d.valueOf() + n), se.updateOffset(i, !1), i) : Ci(e).local();
  }

  function $i(e) {
    return 15 * -Math.round(e._d.getTimezoneOffset() / 15);
  }

  function Ii() {
    return !!this.isValid() && this._isUTC && 0 === this._offset;
  }

  se.updateOffset = function () {};

  var zi = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,
      Gi = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

  function Zi(e, t) {
    var i,
        n,
        s,
        r = e,
        a = null;
    return Vi(e) ? r = {
      ms: e._milliseconds,
      d: e._days,
      M: e._months
    } : de(e) ? (r = {}, t ? r[t] = e : r.milliseconds = e) : (a = zi.exec(e)) ? (i = "-" === a[1] ? -1 : 1, r = {
      y: 0,
      d: ke(a[vt]) * i,
      h: ke(a[wt]) * i,
      m: ke(a[St]) * i,
      s: ke(a[bt]) * i,
      ms: ke(Ri(1e3 * a[kt])) * i
    }) : (a = Gi.exec(e)) ? (i = "-" === a[1] ? -1 : 1, r = {
      y: qi(a[2], i),
      M: qi(a[3], i),
      w: qi(a[4], i),
      d: qi(a[5], i),
      h: qi(a[6], i),
      m: qi(a[7], i),
      s: qi(a[8], i)
    }) : null == r ? r = {} : "object" == typeof r && ("from" in r || "to" in r) && (s = function (e, t) {
      var i;
      if (!e.isValid() || !t.isValid()) return {
        milliseconds: 0,
        months: 0
      };
      t = Ui(t, e), e.isBefore(t) ? i = Bi(e, t) : ((i = Bi(t, e)).milliseconds = -i.milliseconds, i.months = -i.months);
      return i;
    }(Ci(r.from), Ci(r.to)), (r = {}).ms = s.milliseconds, r.M = s.months), n = new Wi(r), Vi(e) && ue(e, "_locale") && (n._locale = e._locale), n;
  }

  function qi(e, t) {
    var i = e && parseFloat(e.replace(",", "."));
    return (isNaN(i) ? 0 : i) * t;
  }

  function Bi(e, t) {
    var i = {};
    return i.months = t.month() - e.month() + 12 * (t.year() - e.year()), e.clone().add(i.months, "M").isAfter(t) && --i.months, i.milliseconds = +t - +e.clone().add(i.months, "M"), i;
  }

  function Ji(e, t) {
    return function (i, n) {
      var s;
      return null === n || isNaN(+n) || (Te(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), s = i, i = n, n = s), Qi(this, Zi(i = "string" == typeof i ? +i : i, n), e), this;
    };
  }

  function Qi(e, t, i, n) {
    var s = t._milliseconds,
        r = Ri(t._days),
        a = Ri(t._months);
    e.isValid() && (n = null == n || n, a && Vt(e, Ct(e, "Month") + a * i), r && Nt(e, "Date", Ct(e, "Date") + r * i), s && e._d.setTime(e._d.valueOf() + s * i), n && se.updateOffset(e, r || a));
  }

  Zi.fn = Wi.prototype, Zi.invalid = function () {
    return Zi(NaN);
  };
  var Xi = Ji(1, "add"),
      Ki = Ji(-1, "subtract");

  function en(e, t) {
    var i = 12 * (t.year() - e.year()) + (t.month() - e.month()),
        n = e.clone().add(i, "months");
    return -(i + (t - n < 0 ? (t - n) / (n - e.clone().add(i - 1, "months")) : (t - n) / (e.clone().add(i + 1, "months") - n))) || 0;
  }

  function tn(e) {
    var t;
    return void 0 === e ? this._locale._abbr : (null != (t = fi(e)) && (this._locale = t), this);
  }

  se.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ", se.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
  var nn = xe("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (e) {
    return void 0 === e ? this.localeData() : this.locale(e);
  });

  function sn() {
    return this._locale;
  }

  var rn = 1e3,
      an = 60 * rn,
      on = 60 * an,
      dn = 3506328 * on;

  function ln(e, t) {
    return (e % t + t) % t;
  }

  function hn(e, t, i) {
    return e < 100 && e >= 0 ? new Date(e + 400, t, i) - dn : new Date(e, t, i).valueOf();
  }

  function un(e, t, i) {
    return e < 100 && e >= 0 ? Date.UTC(e + 400, t, i) - dn : Date.UTC(e, t, i);
  }

  function cn(e, t) {
    Ie(0, [e, e.length], 0, t);
  }

  function fn(e, t, i, n, s) {
    var r;
    return null == e ? zt(this, n, s).year : (t > (r = Gt(e, n, s)) && (t = r), function (e, t, i, n, s) {
      var r = It(e, t, i, n, s),
          a = Ut(r.year, 0, r.dayOfYear);
      return this.year(a.getUTCFullYear()), this.month(a.getUTCMonth()), this.date(a.getUTCDate()), this;
    }.call(this, e, t, i, n, s));
  }

  Ie(0, ["gg", 2], 0, function () {
    return this.weekYear() % 100;
  }), Ie(0, ["GG", 2], 0, function () {
    return this.isoWeekYear() % 100;
  }), cn("gggg", "weekYear"), cn("ggggg", "weekYear"), cn("GGGG", "isoWeekYear"), cn("GGGGG", "isoWeekYear"), Le("weekYear", "gg"), Le("isoWeekYear", "GG"), Re("weekYear", 1), Re("isoWeekYear", 1), ht("G", rt), ht("g", rt), ht("GG", Xe, qe), ht("gg", Xe, qe), ht("GGGG", it, Je), ht("gggg", it, Je), ht("GGGGG", nt, Qe), ht("ggggg", nt, Qe), mt(["gggg", "ggggg", "GGGG", "GGGGG"], function (e, t, i, n) {
    t[n.substr(0, 2)] = ke(e);
  }), mt(["gg", "GG"], function (e, t, i, n) {
    t[n] = se.parseTwoDigitYear(e);
  }), Ie("Q", 0, "Qo", "quarter"), Le("quarter", "Q"), Re("quarter", 7), ht("Q", Ze), _t("Q", function (e, t) {
    t[gt] = 3 * (ke(e) - 1);
  }), Ie("D", ["DD", 2], "Do", "date"), Le("date", "D"), Re("date", 9), ht("D", Xe), ht("DD", Xe, qe), ht("Do", function (e, t) {
    return e ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient;
  }), _t(["D", "DD"], vt), _t("Do", function (e, t) {
    t[vt] = ke(e.match(Xe)[0]);
  });

  var _n = Pt("Date", !0);

  Ie("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), Le("dayOfYear", "DDD"), Re("dayOfYear", 4), ht("DDD", tt), ht("DDDD", Be), _t(["DDD", "DDDD"], function (e, t, i) {
    i._dayOfYear = ke(e);
  }), Ie("m", ["mm", 2], 0, "minute"), Le("minute", "m"), Re("minute", 14), ht("m", Xe), ht("mm", Xe, qe), _t(["m", "mm"], St);
  var mn = Pt("Minutes", !1);
  Ie("s", ["ss", 2], 0, "second"), Le("second", "s"), Re("second", 15), ht("s", Xe), ht("ss", Xe, qe), _t(["s", "ss"], bt);
  var pn,
      yn = Pt("Seconds", !1);

  for (Ie("S", 0, 0, function () {
    return ~~(this.millisecond() / 100);
  }), Ie(0, ["SS", 2], 0, function () {
    return ~~(this.millisecond() / 10);
  }), Ie(0, ["SSS", 3], 0, "millisecond"), Ie(0, ["SSSS", 4], 0, function () {
    return 10 * this.millisecond();
  }), Ie(0, ["SSSSS", 5], 0, function () {
    return 100 * this.millisecond();
  }), Ie(0, ["SSSSSS", 6], 0, function () {
    return 1e3 * this.millisecond();
  }), Ie(0, ["SSSSSSS", 7], 0, function () {
    return 1e4 * this.millisecond();
  }), Ie(0, ["SSSSSSSS", 8], 0, function () {
    return 1e5 * this.millisecond();
  }), Ie(0, ["SSSSSSSSS", 9], 0, function () {
    return 1e6 * this.millisecond();
  }), Le("millisecond", "ms"), Re("millisecond", 16), ht("S", tt, Ze), ht("SS", tt, qe), ht("SSS", tt, Be), pn = "SSSS"; pn.length <= 9; pn += "S") ht(pn, st);

  function gn(e, t) {
    t[kt] = ke(1e3 * ("0." + e));
  }

  for (pn = "S"; pn.length <= 9; pn += "S") _t(pn, gn);

  var vn = Pt("Milliseconds", !1);
  Ie("z", 0, 0, "zoneAbbr"), Ie("zz", 0, 0, "zoneName");
  var wn = we.prototype;

  function Sn(e) {
    return e;
  }

  wn.add = Xi, wn.calendar = function (e, t) {
    var i = e || Ci(),
        n = Ui(i, this).startOf("day"),
        s = se.calendarFormat(this, n) || "sameElse",
        r = t && (Pe(t[s]) ? t[s].call(this, i) : t[s]);
    return this.format(r || this.localeData().calendar(s, this, Ci(i)));
  }, wn.clone = function () {
    return new we(this);
  }, wn.diff = function (e, t, i) {
    var n, s, r;
    if (!this.isValid()) return NaN;
    if (!(n = Ui(e, this)).isValid()) return NaN;

    switch (s = 6e4 * (n.utcOffset() - this.utcOffset()), t = Fe(t)) {
      case "year":
        r = en(this, n) / 12;
        break;

      case "month":
        r = en(this, n);
        break;

      case "quarter":
        r = en(this, n) / 3;
        break;

      case "second":
        r = (this - n) / 1e3;
        break;

      case "minute":
        r = (this - n) / 6e4;
        break;

      case "hour":
        r = (this - n) / 36e5;
        break;

      case "day":
        r = (this - n - s) / 864e5;
        break;

      case "week":
        r = (this - n - s) / 6048e5;
        break;

      default:
        r = this - n;
    }

    return i ? r : be(r);
  }, wn.endOf = function (e) {
    var t;
    if (void 0 === (e = Fe(e)) || "millisecond" === e || !this.isValid()) return this;
    var i = this._isUTC ? un : hn;

    switch (e) {
      case "year":
        t = i(this.year() + 1, 0, 1) - 1;
        break;

      case "quarter":
        t = i(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
        break;

      case "month":
        t = i(this.year(), this.month() + 1, 1) - 1;
        break;

      case "week":
        t = i(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
        break;

      case "isoWeek":
        t = i(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
        break;

      case "day":
      case "date":
        t = i(this.year(), this.month(), this.date() + 1) - 1;
        break;

      case "hour":
        t = this._d.valueOf(), t += on - ln(t + (this._isUTC ? 0 : this.utcOffset() * an), on) - 1;
        break;

      case "minute":
        t = this._d.valueOf(), t += an - ln(t, an) - 1;
        break;

      case "second":
        t = this._d.valueOf(), t += rn - ln(t, rn) - 1;
    }

    return this._d.setTime(t), se.updateOffset(this, !0), this;
  }, wn.format = function (e) {
    e || (e = this.isUtc() ? se.defaultFormatUtc : se.defaultFormat);
    var t = ze(this, e);
    return this.localeData().postformat(t);
  }, wn.from = function (e, t) {
    return this.isValid() && (Se(e) && e.isValid() || Ci(e).isValid()) ? Zi({
      to: this,
      from: e
    }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate();
  }, wn.fromNow = function (e) {
    return this.from(Ci(), e);
  }, wn.to = function (e, t) {
    return this.isValid() && (Se(e) && e.isValid() || Ci(e).isValid()) ? Zi({
      from: this,
      to: e
    }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate();
  }, wn.toNow = function (e) {
    return this.to(Ci(), e);
  }, wn.get = function (e) {
    return Pe(this[e = Fe(e)]) ? this[e]() : this;
  }, wn.invalidAt = function () {
    return _e(this).overflow;
  }, wn.isAfter = function (e, t) {
    var i = Se(e) ? e : Ci(e);
    return !(!this.isValid() || !i.isValid()) && ("millisecond" === (t = Fe(t) || "millisecond") ? this.valueOf() > i.valueOf() : i.valueOf() < this.clone().startOf(t).valueOf());
  }, wn.isBefore = function (e, t) {
    var i = Se(e) ? e : Ci(e);
    return !(!this.isValid() || !i.isValid()) && ("millisecond" === (t = Fe(t) || "millisecond") ? this.valueOf() < i.valueOf() : this.clone().endOf(t).valueOf() < i.valueOf());
  }, wn.isBetween = function (e, t, i, n) {
    var s = Se(e) ? e : Ci(e),
        r = Se(t) ? t : Ci(t);
    return !!(this.isValid() && s.isValid() && r.isValid()) && ("(" === (n = n || "()")[0] ? this.isAfter(s, i) : !this.isBefore(s, i)) && (")" === n[1] ? this.isBefore(r, i) : !this.isAfter(r, i));
  }, wn.isSame = function (e, t) {
    var i,
        n = Se(e) ? e : Ci(e);
    return !(!this.isValid() || !n.isValid()) && ("millisecond" === (t = Fe(t) || "millisecond") ? this.valueOf() === n.valueOf() : (i = n.valueOf(), this.clone().startOf(t).valueOf() <= i && i <= this.clone().endOf(t).valueOf()));
  }, wn.isSameOrAfter = function (e, t) {
    return this.isSame(e, t) || this.isAfter(e, t);
  }, wn.isSameOrBefore = function (e, t) {
    return this.isSame(e, t) || this.isBefore(e, t);
  }, wn.isValid = function () {
    return me(this);
  }, wn.lang = nn, wn.locale = tn, wn.localeData = sn, wn.max = ji, wn.min = Ni, wn.parsingFlags = function () {
    return ce({}, _e(this));
  }, wn.set = function (e, t) {
    if ("object" == typeof e) for (var i = function (e) {
      var t = [];

      for (var i in e) t.push({
        unit: i,
        priority: Ve[i]
      });

      return t.sort(function (e, t) {
        return e.priority - t.priority;
      }), t;
    }(e = We(e)), n = 0; n < i.length; n++) this[i[n].unit](e[i[n].unit]);else if (Pe(this[e = Fe(e)])) return this[e](t);
    return this;
  }, wn.startOf = function (e) {
    var t;
    if (void 0 === (e = Fe(e)) || "millisecond" === e || !this.isValid()) return this;
    var i = this._isUTC ? un : hn;

    switch (e) {
      case "year":
        t = i(this.year(), 0, 1);
        break;

      case "quarter":
        t = i(this.year(), this.month() - this.month() % 3, 1);
        break;

      case "month":
        t = i(this.year(), this.month(), 1);
        break;

      case "week":
        t = i(this.year(), this.month(), this.date() - this.weekday());
        break;

      case "isoWeek":
        t = i(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
        break;

      case "day":
      case "date":
        t = i(this.year(), this.month(), this.date());
        break;

      case "hour":
        t = this._d.valueOf(), t -= ln(t + (this._isUTC ? 0 : this.utcOffset() * an), on);
        break;

      case "minute":
        t = this._d.valueOf(), t -= ln(t, an);
        break;

      case "second":
        t = this._d.valueOf(), t -= ln(t, rn);
    }

    return this._d.setTime(t), se.updateOffset(this, !0), this;
  }, wn.subtract = Ki, wn.toArray = function () {
    var e = this;
    return [e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second(), e.millisecond()];
  }, wn.toObject = function () {
    var e = this;
    return {
      years: e.year(),
      months: e.month(),
      date: e.date(),
      hours: e.hours(),
      minutes: e.minutes(),
      seconds: e.seconds(),
      milliseconds: e.milliseconds()
    };
  }, wn.toDate = function () {
    return new Date(this.valueOf());
  }, wn.toISOString = function (e) {
    if (!this.isValid()) return null;
    var t = !0 !== e,
        i = t ? this.clone().utc() : this;
    return i.year() < 0 || i.year() > 9999 ? ze(i, t ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ") : Pe(Date.prototype.toISOString) ? t ? this.toDate().toISOString() : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3).toISOString().replace("Z", ze(i, "Z")) : ze(i, t ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
  }, wn.inspect = function () {
    if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
    var e = "moment",
        t = "";
    this.isLocal() || (e = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone", t = "Z");
    var i = "[" + e + '("]',
        n = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY",
        s = t + '[")]';
    return this.format(i + n + "-MM-DD[T]HH:mm:ss.SSS" + s);
  }, wn.toJSON = function () {
    return this.isValid() ? this.toISOString() : null;
  }, wn.toString = function () {
    return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
  }, wn.unix = function () {
    return Math.floor(this.valueOf() / 1e3);
  }, wn.valueOf = function () {
    return this._d.valueOf() - 6e4 * (this._offset || 0);
  }, wn.creationData = function () {
    return {
      input: this._i,
      format: this._f,
      locale: this._locale,
      isUTC: this._isUTC,
      strict: this._strict
    };
  }, wn.year = Tt, wn.isLeapYear = function () {
    return Yt(this.year());
  }, wn.weekYear = function (e) {
    return fn.call(this, e, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
  }, wn.isoWeekYear = function (e) {
    return fn.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4);
  }, wn.quarter = wn.quarters = function (e) {
    return null == e ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (e - 1) + this.month() % 3);
  }, wn.month = Rt, wn.daysInMonth = function () {
    return jt(this.year(), this.month());
  }, wn.week = wn.weeks = function (e) {
    var t = this.localeData().week(this);
    return null == e ? t : this.add(7 * (e - t), "d");
  }, wn.isoWeek = wn.isoWeeks = function (e) {
    var t = zt(this, 1, 4).week;
    return null == e ? t : this.add(7 * (e - t), "d");
  }, wn.weeksInYear = function () {
    var e = this.localeData()._week;

    return Gt(this.year(), e.dow, e.doy);
  }, wn.isoWeeksInYear = function () {
    return Gt(this.year(), 1, 4);
  }, wn.date = _n, wn.day = wn.days = function (e) {
    if (!this.isValid()) return null != e ? this : NaN;
    var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    return null != e ? (e = function (e, t) {
      return "string" != typeof e ? e : isNaN(e) ? "number" == typeof (e = t.weekdaysParse(e)) ? e : null : parseInt(e, 10);
    }(e, this.localeData()), this.add(e - t, "d")) : t;
  }, wn.weekday = function (e) {
    if (!this.isValid()) return null != e ? this : NaN;
    var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return null == e ? t : this.add(e - t, "d");
  }, wn.isoWeekday = function (e) {
    if (!this.isValid()) return null != e ? this : NaN;

    if (null != e) {
      var t = function (e, t) {
        return "string" == typeof e ? t.weekdaysParse(e) % 7 || 7 : isNaN(e) ? null : e;
      }(e, this.localeData());

      return this.day(this.day() % 7 ? t : t - 7);
    }

    return this.day() || 7;
  }, wn.dayOfYear = function (e) {
    var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
    return null == e ? t : this.add(e - t, "d");
  }, wn.hour = wn.hours = ri, wn.minute = wn.minutes = mn, wn.second = wn.seconds = yn, wn.millisecond = wn.milliseconds = vn, wn.utcOffset = function (e, t, i) {
    var n,
        s = this._offset || 0;
    if (!this.isValid()) return null != e ? this : NaN;

    if (null != e) {
      if ("string" == typeof e) {
        if (null === (e = Ai(ot, e))) return this;
      } else Math.abs(e) < 16 && !i && (e *= 60);

      return !this._isUTC && t && (n = $i(this)), this._offset = e, this._isUTC = !0, null != n && this.add(n, "m"), s !== e && (!t || this._changeInProgress ? Qi(this, Zi(e - s, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, se.updateOffset(this, !0), this._changeInProgress = null)), this;
    }

    return this._isUTC ? s : $i(this);
  }, wn.utc = function (e) {
    return this.utcOffset(0, e);
  }, wn.local = function (e) {
    return this._isUTC && (this.utcOffset(0, e), this._isUTC = !1, e && this.subtract($i(this), "m")), this;
  }, wn.parseZone = function () {
    if (null != this._tzm) this.utcOffset(this._tzm, !1, !0);else if ("string" == typeof this._i) {
      var e = Ai(at, this._i);
      null != e ? this.utcOffset(e) : this.utcOffset(0, !0);
    }
    return this;
  }, wn.hasAlignedHourOffset = function (e) {
    return !!this.isValid() && (e = e ? Ci(e).utcOffset() : 0, (this.utcOffset() - e) % 60 == 0);
  }, wn.isDST = function () {
    return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
  }, wn.isLocal = function () {
    return !!this.isValid() && !this._isUTC;
  }, wn.isUtcOffset = function () {
    return !!this.isValid() && this._isUTC;
  }, wn.isUtc = Ii, wn.isUTC = Ii, wn.zoneAbbr = function () {
    return this._isUTC ? "UTC" : "";
  }, wn.zoneName = function () {
    return this._isUTC ? "Coordinated Universal Time" : "";
  }, wn.dates = xe("dates accessor is deprecated. Use date instead.", _n), wn.months = xe("months accessor is deprecated. Use month instead", Rt), wn.years = xe("years accessor is deprecated. Use year instead", Tt), wn.zone = xe("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", function (e, t) {
    return null != e ? ("string" != typeof e && (e = -e), this.utcOffset(e, t), this) : -this.utcOffset();
  }), wn.isDSTShifted = xe("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", function () {
    if (!oe(this._isDSTShifted)) return this._isDSTShifted;
    var e = {};

    if (ge(e, this), (e = Ti(e))._a) {
      var t = e._isUTC ? fe(e._a) : Ci(e._a);
      this._isDSTShifted = this.isValid() && Me(e._a, t.toArray()) > 0;
    } else this._isDSTShifted = !1;

    return this._isDSTShifted;
  });
  var bn = Ne.prototype;

  function kn(e, t, i, n) {
    var s = fi(),
        r = fe().set(n, t);
    return s[i](r, e);
  }

  function Mn(e, t, i) {
    if (de(e) && (t = e, e = void 0), e = e || "", null != t) return kn(e, t, i, "month");
    var n,
        s = [];

    for (n = 0; n < 12; n++) s[n] = kn(e, n, i, "month");

    return s;
  }

  function Dn(e, t, i, n) {
    "boolean" == typeof e ? (de(t) && (i = t, t = void 0), t = t || "") : (i = t = e, e = !1, de(t) && (i = t, t = void 0), t = t || "");
    var s,
        r = fi(),
        a = e ? r._week.dow : 0;
    if (null != i) return kn(t, (i + a) % 7, n, "day");
    var o = [];

    for (s = 0; s < 7; s++) o[s] = kn(t, (s + a) % 7, n, "day");

    return o;
  }

  bn.calendar = function (e, t, i) {
    var n = this._calendar[e] || this._calendar.sameElse;
    return Pe(n) ? n.call(t, i) : n;
  }, bn.longDateFormat = function (e) {
    var t = this._longDateFormat[e],
        i = this._longDateFormat[e.toUpperCase()];

    return t || !i ? t : (this._longDateFormat[e] = i.replace(/MMMM|MM|DD|dddd/g, function (e) {
      return e.slice(1);
    }), this._longDateFormat[e]);
  }, bn.invalidDate = function () {
    return this._invalidDate;
  }, bn.ordinal = function (e) {
    return this._ordinal.replace("%d", e);
  }, bn.preparse = Sn, bn.postformat = Sn, bn.relativeTime = function (e, t, i, n) {
    var s = this._relativeTime[i];
    return Pe(s) ? s(e, t, i, n) : s.replace(/%d/i, e);
  }, bn.pastFuture = function (e, t) {
    var i = this._relativeTime[e > 0 ? "future" : "past"];
    return Pe(i) ? i(t) : i.replace(/%s/i, t);
  }, bn.set = function (e) {
    var t, i;

    for (i in e) Pe(t = e[i]) ? this[i] = t : this["_" + i] = t;

    this._config = e, this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
  }, bn.months = function (e, t) {
    return e ? re(this._months) ? this._months[e.month()] : this._months[(this._months.isFormat || Lt).test(t) ? "format" : "standalone"][e.month()] : re(this._months) ? this._months : this._months.standalone;
  }, bn.monthsShort = function (e, t) {
    return e ? re(this._monthsShort) ? this._monthsShort[e.month()] : this._monthsShort[Lt.test(t) ? "format" : "standalone"][e.month()] : re(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
  }, bn.monthsParse = function (e, t, i) {
    var n, s, r;
    if (this._monthsParseExact) return function (e, t, i) {
      var n,
          s,
          r,
          a = e.toLocaleLowerCase();
      if (!this._monthsParse) for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], n = 0; n < 12; ++n) r = fe([2e3, n]), this._shortMonthsParse[n] = this.monthsShort(r, "").toLocaleLowerCase(), this._longMonthsParse[n] = this.months(r, "").toLocaleLowerCase();
      return i ? "MMM" === t ? -1 !== (s = Ot.call(this._shortMonthsParse, a)) ? s : null : -1 !== (s = Ot.call(this._longMonthsParse, a)) ? s : null : "MMM" === t ? -1 !== (s = Ot.call(this._shortMonthsParse, a)) ? s : -1 !== (s = Ot.call(this._longMonthsParse, a)) ? s : null : -1 !== (s = Ot.call(this._longMonthsParse, a)) ? s : -1 !== (s = Ot.call(this._shortMonthsParse, a)) ? s : null;
    }.call(this, e, t, i);

    for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), n = 0; n < 12; n++) {
      if (s = fe([2e3, n]), i && !this._longMonthsParse[n] && (this._longMonthsParse[n] = new RegExp("^" + this.months(s, "").replace(".", "") + "$", "i"), this._shortMonthsParse[n] = new RegExp("^" + this.monthsShort(s, "").replace(".", "") + "$", "i")), i || this._monthsParse[n] || (r = "^" + this.months(s, "") + "|^" + this.monthsShort(s, ""), this._monthsParse[n] = new RegExp(r.replace(".", ""), "i")), i && "MMMM" === t && this._longMonthsParse[n].test(e)) return n;
      if (i && "MMM" === t && this._shortMonthsParse[n].test(e)) return n;
      if (!i && this._monthsParse[n].test(e)) return n;
    }
  }, bn.monthsRegex = function (e) {
    return this._monthsParseExact ? (ue(this, "_monthsRegex") || At.call(this), e ? this._monthsStrictRegex : this._monthsRegex) : (ue(this, "_monthsRegex") || (this._monthsRegex = Ht), this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex);
  }, bn.monthsShortRegex = function (e) {
    return this._monthsParseExact ? (ue(this, "_monthsRegex") || At.call(this), e ? this._monthsShortStrictRegex : this._monthsShortRegex) : (ue(this, "_monthsShortRegex") || (this._monthsShortRegex = Et), this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex);
  }, bn.week = function (e) {
    return zt(e, this._week.dow, this._week.doy).week;
  }, bn.firstDayOfYear = function () {
    return this._week.doy;
  }, bn.firstDayOfWeek = function () {
    return this._week.dow;
  }, bn.weekdays = function (e, t) {
    var i = re(this._weekdays) ? this._weekdays : this._weekdays[e && !0 !== e && this._weekdays.isFormat.test(t) ? "format" : "standalone"];
    return !0 === e ? Zt(i, this._week.dow) : e ? i[e.day()] : i;
  }, bn.weekdaysMin = function (e) {
    return !0 === e ? Zt(this._weekdaysMin, this._week.dow) : e ? this._weekdaysMin[e.day()] : this._weekdaysMin;
  }, bn.weekdaysShort = function (e) {
    return !0 === e ? Zt(this._weekdaysShort, this._week.dow) : e ? this._weekdaysShort[e.day()] : this._weekdaysShort;
  }, bn.weekdaysParse = function (e, t, i) {
    var n, s, r;
    if (this._weekdaysParseExact) return function (e, t, i) {
      var n,
          s,
          r,
          a = e.toLocaleLowerCase();
      if (!this._weekdaysParse) for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], n = 0; n < 7; ++n) r = fe([2e3, 1]).day(n), this._minWeekdaysParse[n] = this.weekdaysMin(r, "").toLocaleLowerCase(), this._shortWeekdaysParse[n] = this.weekdaysShort(r, "").toLocaleLowerCase(), this._weekdaysParse[n] = this.weekdays(r, "").toLocaleLowerCase();
      return i ? "dddd" === t ? -1 !== (s = Ot.call(this._weekdaysParse, a)) ? s : null : "ddd" === t ? -1 !== (s = Ot.call(this._shortWeekdaysParse, a)) ? s : null : -1 !== (s = Ot.call(this._minWeekdaysParse, a)) ? s : null : "dddd" === t ? -1 !== (s = Ot.call(this._weekdaysParse, a)) ? s : -1 !== (s = Ot.call(this._shortWeekdaysParse, a)) ? s : -1 !== (s = Ot.call(this._minWeekdaysParse, a)) ? s : null : "ddd" === t ? -1 !== (s = Ot.call(this._shortWeekdaysParse, a)) ? s : -1 !== (s = Ot.call(this._weekdaysParse, a)) ? s : -1 !== (s = Ot.call(this._minWeekdaysParse, a)) ? s : null : -1 !== (s = Ot.call(this._minWeekdaysParse, a)) ? s : -1 !== (s = Ot.call(this._weekdaysParse, a)) ? s : -1 !== (s = Ot.call(this._shortWeekdaysParse, a)) ? s : null;
    }.call(this, e, t, i);

    for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), n = 0; n < 7; n++) {
      if (s = fe([2e3, 1]).day(n), i && !this._fullWeekdaysParse[n] && (this._fullWeekdaysParse[n] = new RegExp("^" + this.weekdays(s, "").replace(".", "\\.?") + "$", "i"), this._shortWeekdaysParse[n] = new RegExp("^" + this.weekdaysShort(s, "").replace(".", "\\.?") + "$", "i"), this._minWeekdaysParse[n] = new RegExp("^" + this.weekdaysMin(s, "").replace(".", "\\.?") + "$", "i")), this._weekdaysParse[n] || (r = "^" + this.weekdays(s, "") + "|^" + this.weekdaysShort(s, "") + "|^" + this.weekdaysMin(s, ""), this._weekdaysParse[n] = new RegExp(r.replace(".", ""), "i")), i && "dddd" === t && this._fullWeekdaysParse[n].test(e)) return n;
      if (i && "ddd" === t && this._shortWeekdaysParse[n].test(e)) return n;
      if (i && "dd" === t && this._minWeekdaysParse[n].test(e)) return n;
      if (!i && this._weekdaysParse[n].test(e)) return n;
    }
  }, bn.weekdaysRegex = function (e) {
    return this._weekdaysParseExact ? (ue(this, "_weekdaysRegex") || ei.call(this), e ? this._weekdaysStrictRegex : this._weekdaysRegex) : (ue(this, "_weekdaysRegex") || (this._weekdaysRegex = Qt), this._weekdaysStrictRegex && e ? this._weekdaysStrictRegex : this._weekdaysRegex);
  }, bn.weekdaysShortRegex = function (e) {
    return this._weekdaysParseExact ? (ue(this, "_weekdaysRegex") || ei.call(this), e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (ue(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = Xt), this._weekdaysShortStrictRegex && e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
  }, bn.weekdaysMinRegex = function (e) {
    return this._weekdaysParseExact ? (ue(this, "_weekdaysRegex") || ei.call(this), e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (ue(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Kt), this._weekdaysMinStrictRegex && e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
  }, bn.isPM = function (e) {
    return "p" === (e + "").toLowerCase().charAt(0);
  }, bn.meridiem = function (e, t, i) {
    return e > 11 ? i ? "pm" : "PM" : i ? "am" : "AM";
  }, ui("en", {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function (e) {
      var t = e % 10;
      return e + (1 === ke(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th");
    }
  }), se.lang = xe("moment.lang is deprecated. Use moment.locale instead.", ui), se.langData = xe("moment.langData is deprecated. Use moment.localeData instead.", fi);
  var xn = Math.abs;

  function Yn(e, t, i, n) {
    var s = Zi(t, i);
    return e._milliseconds += n * s._milliseconds, e._days += n * s._days, e._months += n * s._months, e._bubble();
  }

  function On(e) {
    return e < 0 ? Math.floor(e) : Math.ceil(e);
  }

  function Tn(e) {
    return 4800 * e / 146097;
  }

  function Pn(e) {
    return 146097 * e / 4800;
  }

  function Cn(e) {
    return function () {
      return this.as(e);
    };
  }

  var Nn = Cn("ms"),
      jn = Cn("s"),
      Ln = Cn("m"),
      Fn = Cn("h"),
      Wn = Cn("d"),
      Vn = Cn("w"),
      Rn = Cn("M"),
      En = Cn("Q"),
      Hn = Cn("y");

  function An(e) {
    return function () {
      return this.isValid() ? this._data[e] : NaN;
    };
  }

  var Un = An("milliseconds"),
      $n = An("seconds"),
      In = An("minutes"),
      zn = An("hours"),
      Gn = An("days"),
      Zn = An("months"),
      qn = An("years");
  var Bn = Math.round,
      Jn = {
    ss: 44,
    s: 45,
    m: 45,
    h: 22,
    d: 26,
    M: 11
  };
  var Qn = Math.abs;

  function Xn(e) {
    return (e > 0) - (e < 0) || +e;
  }

  function Kn() {
    if (!this.isValid()) return this.localeData().invalidDate();
    var e,
        t,
        i = Qn(this._milliseconds) / 1e3,
        n = Qn(this._days),
        s = Qn(this._months);
    e = be(i / 60), t = be(e / 60), i %= 60, e %= 60;
    var r = be(s / 12),
        a = s %= 12,
        o = n,
        d = t,
        l = e,
        h = i ? i.toFixed(3).replace(/\.?0+$/, "") : "",
        u = this.asSeconds();
    if (!u) return "P0D";

    var c = u < 0 ? "-" : "",
        f = Xn(this._months) !== Xn(u) ? "-" : "",
        _ = Xn(this._days) !== Xn(u) ? "-" : "",
        m = Xn(this._milliseconds) !== Xn(u) ? "-" : "";

    return c + "P" + (r ? f + r + "Y" : "") + (a ? f + a + "M" : "") + (o ? _ + o + "D" : "") + (d || l || h ? "T" : "") + (d ? m + d + "H" : "") + (l ? m + l + "M" : "") + (h ? m + h + "S" : "");
  }

  var es = Wi.prototype;
  es.isValid = function () {
    return this._isValid;
  }, es.abs = function () {
    var e = this._data;
    return this._milliseconds = xn(this._milliseconds), this._days = xn(this._days), this._months = xn(this._months), e.milliseconds = xn(e.milliseconds), e.seconds = xn(e.seconds), e.minutes = xn(e.minutes), e.hours = xn(e.hours), e.months = xn(e.months), e.years = xn(e.years), this;
  }, es.add = function (e, t) {
    return Yn(this, e, t, 1);
  }, es.subtract = function (e, t) {
    return Yn(this, e, t, -1);
  }, es.as = function (e) {
    if (!this.isValid()) return NaN;
    var t,
        i,
        n = this._milliseconds;
    if ("month" === (e = Fe(e)) || "quarter" === e || "year" === e) switch (t = this._days + n / 864e5, i = this._months + Tn(t), e) {
      case "month":
        return i;

      case "quarter":
        return i / 3;

      case "year":
        return i / 12;
    } else switch (t = this._days + Math.round(Pn(this._months)), e) {
      case "week":
        return t / 7 + n / 6048e5;

      case "day":
        return t + n / 864e5;

      case "hour":
        return 24 * t + n / 36e5;

      case "minute":
        return 1440 * t + n / 6e4;

      case "second":
        return 86400 * t + n / 1e3;

      case "millisecond":
        return Math.floor(864e5 * t) + n;

      default:
        throw new Error("Unknown unit " + e);
    }
  }, es.asMilliseconds = Nn, es.asSeconds = jn, es.asMinutes = Ln, es.asHours = Fn, es.asDays = Wn, es.asWeeks = Vn, es.asMonths = Rn, es.asQuarters = En, es.asYears = Hn, es.valueOf = function () {
    return this.isValid() ? this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * ke(this._months / 12) : NaN;
  }, es._bubble = function () {
    var e,
        t,
        i,
        n,
        s,
        r = this._milliseconds,
        a = this._days,
        o = this._months,
        d = this._data;
    return r >= 0 && a >= 0 && o >= 0 || r <= 0 && a <= 0 && o <= 0 || (r += 864e5 * On(Pn(o) + a), a = 0, o = 0), d.milliseconds = r % 1e3, e = be(r / 1e3), d.seconds = e % 60, t = be(e / 60), d.minutes = t % 60, i = be(t / 60), d.hours = i % 24, a += be(i / 24), o += s = be(Tn(a)), a -= On(Pn(s)), n = be(o / 12), o %= 12, d.days = a, d.months = o, d.years = n, this;
  }, es.clone = function () {
    return Zi(this);
  }, es.get = function (e) {
    return e = Fe(e), this.isValid() ? this[e + "s"]() : NaN;
  }, es.milliseconds = Un, es.seconds = $n, es.minutes = In, es.hours = zn, es.days = Gn, es.weeks = function () {
    return be(this.days() / 7);
  }, es.months = Zn, es.years = qn, es.humanize = function (e) {
    if (!this.isValid()) return this.localeData().invalidDate();

    var t = this.localeData(),
        i = function (e, t, i) {
      var n = Zi(e).abs(),
          s = Bn(n.as("s")),
          r = Bn(n.as("m")),
          a = Bn(n.as("h")),
          o = Bn(n.as("d")),
          d = Bn(n.as("M")),
          l = Bn(n.as("y")),
          h = s <= Jn.ss && ["s", s] || s < Jn.s && ["ss", s] || r <= 1 && ["m"] || r < Jn.m && ["mm", r] || a <= 1 && ["h"] || a < Jn.h && ["hh", a] || o <= 1 && ["d"] || o < Jn.d && ["dd", o] || d <= 1 && ["M"] || d < Jn.M && ["MM", d] || l <= 1 && ["y"] || ["yy", l];
      return h[2] = t, h[3] = +e > 0, h[4] = i, function (e, t, i, n, s) {
        return s.relativeTime(t || 1, !!i, e, n);
      }.apply(null, h);
    }(this, !e, t);

    return e && (i = t.pastFuture(+this, i)), t.postformat(i);
  }, es.toISOString = Kn, es.toString = Kn, es.toJSON = Kn, es.locale = tn, es.localeData = sn, es.toIsoString = xe("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", Kn), es.lang = nn, Ie("X", 0, 0, "unix"), Ie("x", 0, 0, "valueOf"), ht("x", rt), ht("X", /[+-]?\d+(\.\d{1,3})?/), _t("X", function (e, t, i) {
    i._d = new Date(1e3 * parseFloat(e, 10));
  }), _t("x", function (e, t, i) {
    i._d = new Date(ke(e));
  }), se.version = "2.24.0", ie = Ci, se.fn = wn, se.min = function () {
    return Li("isBefore", [].slice.call(arguments, 0));
  }, se.max = function () {
    return Li("isAfter", [].slice.call(arguments, 0));
  }, se.now = function () {
    return Date.now ? Date.now() : +new Date();
  }, se.utc = fe, se.unix = function (e) {
    return Ci(1e3 * e);
  }, se.months = function (e, t) {
    return Mn(e, t, "months");
  }, se.isDate = le, se.locale = ui, se.invalid = pe, se.duration = Zi, se.isMoment = Se, se.weekdays = function (e, t, i) {
    return Dn(e, t, i, "weekdays");
  }, se.parseZone = function () {
    return Ci.apply(null, arguments).parseZone();
  }, se.localeData = fi, se.isDuration = Vi, se.monthsShort = function (e, t) {
    return Mn(e, t, "monthsShort");
  }, se.weekdaysMin = function (e, t, i) {
    return Dn(e, t, i, "weekdaysMin");
  }, se.defineLocale = ci, se.updateLocale = function (e, t) {
    if (null != t) {
      var i,
          n,
          s = ai;
      null != (n = hi(e)) && (s = n._config), (i = new Ne(t = Ce(s, t))).parentLocale = oi[e], oi[e] = i, ui(e);
    } else null != oi[e] && (null != oi[e].parentLocale ? oi[e] = oi[e].parentLocale : null != oi[e] && delete oi[e]);

    return oi[e];
  }, se.locales = function () {
    return Ye(oi);
  }, se.weekdaysShort = function (e, t, i) {
    return Dn(e, t, i, "weekdaysShort");
  }, se.normalizeUnits = Fe, se.relativeTimeRounding = function (e) {
    return void 0 === e ? Bn : "function" == typeof e && (Bn = e, !0);
  }, se.relativeTimeThreshold = function (e, t) {
    return void 0 !== Jn[e] && (void 0 === t ? Jn[e] : (Jn[e] = t, "s" === e && (Jn.ss = t - 1), !0));
  }, se.calendarFormat = function (e, t) {
    var i = e.diff(t, "days", !0);
    return i < -6 ? "sameElse" : i < -1 ? "lastWeek" : i < 0 ? "lastDay" : i < 1 ? "sameDay" : i < 2 ? "nextDay" : i < 7 ? "nextWeek" : "sameElse";
  }, se.prototype = wn, se.HTML5_FMT = {
    DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
    DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
    DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
    DATE: "YYYY-MM-DD",
    TIME: "HH:mm",
    TIME_SECONDS: "HH:mm:ss",
    TIME_MS: "HH:mm:ss.SSS",
    WEEK: "GGGG-[W]WW",
    MONTH: "YYYY-MM"
  };
  var ts = "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),
      is = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),
      ns = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i],
      ss = /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
  se.defineLocale("nl", {
    months: "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),
    monthsShort: function (e, t) {
      return e ? /-MMM-/.test(t) ? is[e.month()] : ts[e.month()] : ts;
    },
    monthsRegex: ss,
    monthsShortRegex: ss,
    monthsStrictRegex: /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,
    monthsParse: ns,
    longMonthsParse: ns,
    shortMonthsParse: ns,
    weekdays: "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
    weekdaysShort: "zo._ma._di._wo._do._vr._za.".split("_"),
    weekdaysMin: "zo_ma_di_wo_do_vr_za".split("_"),
    weekdaysParseExact: !0,
    longDateFormat: {
      LT: "HH:mm",
      LTS: "HH:mm:ss",
      L: "DD-MM-YYYY",
      LL: "D MMMM YYYY",
      LLL: "D MMMM YYYY HH:mm",
      LLLL: "dddd D MMMM YYYY HH:mm"
    },
    calendar: {
      sameDay: "[vandaag om] LT",
      nextDay: "[morgen om] LT",
      nextWeek: "dddd [om] LT",
      lastDay: "[gisteren om] LT",
      lastWeek: "[afgelopen] dddd [om] LT",
      sameElse: "L"
    },
    relativeTime: {
      future: "over %s",
      past: "%s geleden",
      s: "een paar seconden",
      ss: "%d seconden",
      m: "één minuut",
      mm: "%d minuten",
      h: "één uur",
      hh: "%d uur",
      d: "één dag",
      dd: "%d dagen",
      M: "één maand",
      MM: "%d maanden",
      y: "één jaar",
      yy: "%d jaar"
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    ordinal: function (e) {
      return e + (1 === e || 8 === e || e >= 20 ? "ste" : "de");
    },
    week: {
      dow: 1,
      doy: 4
    }
  });
  const rs = {
    delivered: !1,
    first_letter: !1,
    header: !1
  },
        as = {
    en: {
      unavailable_entities: "The given entities are not available. Please check your card configuration",
      unavailable_letters: "It seems you have set the letter object, but you haven't activated this within PostNL yet. Consider removing the letter object from the card or activate this option in PostNL.",
      letters: "Letters",
      title: "Title",
      status: "Status",
      delivery_date: "Delivery date",
      enroute: "Enroute",
      delivered: "Delivered",
      delivery: "Delivery",
      distribution: "Distribution",
      unknown: "Unknown"
    },
    nl: {
      unavailable_entities: "De opgegeven entiteiten zijn niet beschikbaar. Controleer je card configuratie",
      unavailable_letters: "Het lijkt er op dat je brieven hebt geconfigureerd in deze card, maar je hebt deze niet binnen de PostNL app geactiveerd. Verwijder de brieven van deze card of activeer ze binnen de PostNL app.",
      letters: "Brieven",
      title: "Titel",
      status: "Status",
      delivery_date: "Bezorgdatum",
      enroute: "Onderweg",
      delivered: "Afgeleverd",
      delivery: "Ontvangen",
      distribution: "Versturen",
      unknown: "Onbekend"
    }
  };

  class os extends te {
    static get properties() {
      return {
        _hass: Object,
        config: Object,
        deliveryObject: Object,
        distributionObject: Object,
        letterObject: Object,
        icon: String,
        name: String,
        date_format: String,
        time_format: String,
        past_days: String,
        _language: String,
        _hide: Object
      };
    }

    constructor() {
      super(), this._hass = null, this.deliveryObject = null, this.distributionObject = null, this.letterObject = null, this.delivery_enroute = [], this.delivery_delivered = [], this.distribution_enroute = [], this.distribution_delivered = [], this.letters = [], this.icon = null, this.name = null, this.date_format = null, this.time_format = null, this.past_days = null, this._language = null, this._hide = rs, this._lang = as;
    }

    set hass(e) {
      this._hass = e, this.config.delivery && (this.deliveryObject = e.states[this.config.delivery]), this.config.distribution && (this.distributionObject = e.states[this.config.distribution]), this.config.letters && (this.letterObject = e.states[this.config.letters]), this.config.hide && (this._hide = { ...this._hide,
        ...this.config.hide
      }), "string" == typeof this.config.name ? this.name = this.config.name : this.name = "PostNL", this.config.icon ? this.icon = this.config.icon : this.icon = "mdi:mailbox", this.config.date_format ? this.date_format = this.config.date_format : this.date_format = "DD MMM YYYY", this.config.time_format ? this.time_format = this.config.time_format : this.time_format = "HH:mm", this.config.past_days ? this.past_days = parseInt(this.config.past_days, 10) : this.past_days = 1, this._language = e.language, "nl" !== this._language && (this._language = "en"), this.delivery_enroute = [], this.delivery_delivered = [], this.distribution_enroute = [], this.distribution_delivered = [], this.letters = [], this.letterObject && Object.entries(this.letterObject.attributes.letters).sort((e, t) => new Date(t[1].delivery_date) - new Date(e[1].delivery_date)).map(([e, t]) => {
        se(t.delivery_date).isBefore(se().subtract(this.past_days, "days").startOf("day")) || this.letters.push(t);
      }), this.deliveryObject && (Object.entries(this.deliveryObject.attributes.enroute).sort((e, t) => new Date(t[1].planned_date) - new Date(e[1].planned_date)).map(([e, t]) => {
        this.delivery_enroute.push(t);
      }), Object.entries(this.deliveryObject.attributes.delivered).sort((e, t) => new Date(t[1].delivery_date) - new Date(e[1].delivery_date)).map(([e, t]) => {
        null != t.delivery_date && se(t.delivery_date).isBefore(se().subtract(this.past_days, "days").startOf("day")) || this.delivery_delivered.push(t);
      })), this.distributionObject && (Object.entries(this.distributionObject.attributes.enroute).sort((e, t) => new Date(t[1].planned_date) - new Date(e[1].planned_date)).map(([e, t]) => {
        this.distribution_enroute.push(t);
      }), Object.entries(this.distributionObject.attributes.delivered).sort((e, t) => new Date(t[1].delivery_date) - new Date(e[1].delivery_date)).map(([e, t]) => {
        null != t.delivery_date && se(t.delivery_date).isBefore(se().subtract(this.past_days, "days").startOf("day")) || this.distribution_delivered.push(t);
      }));
    }

    render({
      _hass: e,
      _hide: t,
      _values: i,
      config: n,
      delivery: s,
      distribution: r,
      letters: a
    } = this) {
      return s || r || a ? N`
      ${N`
    <style is="custom-style">
      ha-card {
        -webkit-font-smoothing: var(
          --paper-font-body1_-_-webkit-font-smoothing
        );
        font-size: var(--paper-font-body1_-_font-size);
        font-weight: var(--paper-font-body1_-_font-weight);
        line-height: var(--paper-font-body1_-_line-height);
        padding-bottom: 16px;
      }
      ha-card.no-header {
        padding: 16px 0;
      }
      .info-body,
      .detail-body,
      .img-body {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
      }
      .info {
        text-align: center;
      }

      .info__icon {
        color: var(--paper-item-icon-color, #44739e);
      }
      .detail-body table {
        padding: 0px 16px;
        width: 100%;
      }
      .detail-body td {
        padding: 2px;
      }
      .detail-body thead th {
        text-align: left;
      }
      .detail-body tbody tr:nth-child(odd) {
        background-color: var(--paper-card-background-color);
      }
      .detail-body tbody tr:nth-child(even) {
        background-color: var(--secondary-background-color);
      }
      .detail-body tbody td.name a {
        color: var(--primary-text-color);
        text-decoration-line: none;
        font-weight: normal;
      }
      .img-body {
        margin-bottom: 10px;
      }
      .img-body img {
        padding: 5px;
        background: repeating-linear-gradient(
          45deg,
          #B45859,
          #B45859 10px,
          #FFFFFF 10px,
          #FFFFFF 20px,
          #122F94 20px,
          #122F94 30px,
          #FFFFFF 30px,
          #FFFFFF 40px
        );
      }

      header {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-family: var(--paper-font-headline_-_font-family);
        -webkit-font-smoothing: var(
          --paper-font-headline_-_-webkit-font-smoothing
        );
        font-size: var(--paper-font-headline_-_font-size);
        font-weight: var(--paper-font-headline_-_font-weight);
        letter-spacing: var(--paper-font-headline_-_letter-spacing);
        line-height: var(--paper-font-headline_-_line-height);
        text-rendering: var(
          --paper-font-common-expensive-kerning_-_text-rendering
        );
        opacity: var(--dark-primary-opacity);
        padding: 24px
          16px
          16px;
      }
      .header__icon {
        margin-right: 8px;
        color: var(--paper-item-icon-color, #44739e);
      }
      .header__title {
        font-size: var(--thermostat-font-size-title);
        line-height: var(--thermostat-font-size-title);
        font-weight: normal;
        margin: 0;
        align-self: left;
      }

      footer {
        padding: 16px;
        color: red;
      }
    </style>
  `}
      <ha-card class="postnl-card">
        ${this.renderHeader()}
        <section class="info-body">
          ${this.renderLettersInfo()}
          ${this.renderDeliveryInfo()}
          ${this.renderDistributionInfo()}
        </section>

      ${this.renderLetters()}
      ${this.renderDelivery()}
      ${this.renderDistribution()}
      ${this.renderLetterWarning()}

      </ha-card>
    ` : N`
        ${N`
    <style is="custom-style">
      ha-card {
        font-weight: var(--paper-font-body1_-_font-weight);
        line-height: var(--paper-font-body1_-_line-height);
      }
      .not-found {
        flex: 1;
        background-color: red;
        padding: calc(16px);
      }
    </style>
  `}
        <ha-card class="not-found">
          ${this.translate("unavailable_entities")}
        </ha-card>
      `;
    }

    renderHeader() {
      return this._hide.header ? "" : N`
      <header>
        <ha-icon class="header__icon" .icon=${this.icon}></ha-icon>
        <h2 class="header__title">${this.name}</h2>
      </header>
    `;
    }

    renderLetterWarning() {
      return this.letterObject ? void 0 === this.letterObject.attributes.enabled || this.letterObject.attributes.enabled ? "" : N`
      <footer>
        ${this.translate("unavailable_letters")}
      </footer>
    ` : "";
    }

    renderLettersInfo() {
      return this.letterObject ? N`
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:email"></ha-icon><br />
        <span>${this.letters.length} ${this.translate("letters")}</span>
      </div>
    ` : "";
    }

    renderLetters() {
      return !this.letterObject || this.letters && 0 === this.letters.length ? "" : N`
      <header>
        <ha-icon class="header__icon" icon="mdi:email"></ha-icon>
        <h2 class="header__title">${this.translate("letters")}</h2>
      </header>
      ${this.renderLetterImage()}
      <section class="detail-body">
        <table>
          <thead>
            <tr>
              <th>${this.translate("title")}</th>
              <th>${this.translate("status")}</th>
              <th>${this.translate("delivery_date")}</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(this.letters).map(([e, t]) => this.renderLetter(t))}
          </tbody>
        </table>
      </section>
    `;
    }

    renderLetterImage() {
      return this._hide.first_letter ? "" : null == this.letters[0] || null == this.letters[0].image ? "" : N`
      <section class="img-body">
        <img src="${this.letters[0].image}&width=400&height=300" />
      </section>
    `;
    }

    renderLetter(e) {
      return null == e.image ? N`
        <tr>
          <td class="name">${e.id}</td>
          <td>${null != e.status_message ? e.status_message : this.translate("unknown")}</td>
          <td>${this.dateConversion(e.delivery_date)}</td>
        </tr>
      ` : N`
        <tr>
          <td class="name"><a href="${e.image}" target="_blank">${e.id}</a></td>
          <td>${null != e.status_message ? e.status_message : this.translate("unknown")}</td>
          <td>${this.dateConversion(e.delivery_date)}</td>
        </tr>
      `;
    }

    renderDeliveryInfo() {
      return this.deliveryObject ? N`
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:truck-delivery"></ha-icon><br />
        <span>${this.delivery_enroute.length} ${this.translate("enroute")}</span>
      </div>
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:package-variant"></ha-icon><br />
        <span>${this.delivery_delivered.length} ${this.translate("delivered")}</span>
      </div>
    ` : "";
    }

    renderDistributionInfo() {
      return this.distributionObject ? N`
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:truck-delivery"></ha-icon><br />
        <span>${this.distribution_enroute.length} ${this.translate("enroute")}</span>
      </div>
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:package-variant"></ha-icon><br />
        <span>${this.distribution_delivered.length} ${this.translate("delivered")}</span>
      </div>
    ` : "";
    }

    renderDelivery() {
      return this.deliveryObject ? 0 === this.delivery_enroute.length && this._hide.delivered ? "" : 0 === this.delivery_enroute.length && 0 === this.delivery_delivered.length ? "" : N`
      <header>
        <ha-icon class="header__icon" icon="mdi:package-variant"></ha-icon>
        <h2 class="header__title">${this.translate("delivery")}</h2>
      </header>
      <section class="detail-body">
        <table>
          <thead>
            <tr>
              <th>${this.translate("title")}</th>
              <th>${this.translate("status")}</th>
              <th>${this.translate("delivery_date")}</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(this.delivery_enroute).map(([e, t]) => this.renderShipment(t))}

            ${this._hide.delivered ? "" : Object.entries(this.delivery_delivered).map(([e, t]) => this.renderShipment(t))}
          </tbody>
        </table>
      </section>
    ` : "";
    }

    renderDistribution() {
      return this.distributionObject ? 0 === this.distribution_enroute.length && this._hide.delivered ? "" : 0 === this.distribution_enroute.length && 0 === this.distribution_delivered.length ? "" : N`
      <header>
        <ha-icon class="header__icon" icon="mdi:package-variant"></ha-icon>
        <h2 class="header__title">${this.translate("distribution")}</h2>
      </header>
      <section class="detail-body">
        <table>
          <thead>
            <tr>
              <th>${this.translate("title")}</th>
              <th>${this.translate("status")}</th>
              <th>${this.translate("delivery_date")}</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(this.distribution_enroute).map(([e, t]) => this.renderShipment(t))}

            ${this._hide.delivered ? "" : Object.entries(this.distribution_delivered).map(([e, t]) => this.renderShipment(t))}
          </tbody>
        </table>
      </section>
    ` : "";
    }

    renderShipment(e) {
      let t = this.translate("unknown"),
          i = "delivered";
      return null != e.delivery_date ? t = this.dateConversion(e.delivery_date) : null != e.planned_date && (i = "enroute", t = `${this.dateConversion(e.planned_date)} ${this.timeConversion(e.planned_from)} - ${this.timeConversion(e.planned_to)}`), N`
        <tr class="${i}">
          <td class="name"><a href="${e.url}" target="_blank">${e.name}</a></td>
          <td>${e.status_message}</td>
          <td>${t}</td>
        </tr>
    `;
    }

    dateConversion(e) {
      const t = se(e);
      return t.locale(this._language), t.calendar(null, {
        sameDay: "[Today]",
        nextDay: "[Tomorrow]",
        sameElse: this.date_format
      });
    }

    timeConversion(e) {
      const t = se(e);
      return t.locale(this._language), t.format(this.time_format);
    }

    translate(e) {
      return this._lang[this._language][e];
    }

    setConfig(e) {
      if (!e.delivery && !e.distribution && !e.letters) throw new Error("Please define entities");
      this.config = { ...e
      };
    }

    getCardSize() {
      return 3;
    }

  }

  return window.customElements.define("postnl-card", os), os;
});
