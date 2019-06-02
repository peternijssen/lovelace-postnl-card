!function (e, t) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).PostNLCard = t();
}(this, function () {
  "use strict";

  const e = new WeakMap(),
        t = t => "function" == typeof t && e.has(t),
        i = void 0 !== window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback,
        s = (e, t, i = null) => {
    for (; t !== i;) {
      const i = t.nextSibling;
      e.removeChild(t), t = i;
    }
  },
        n = {},
        r = {},
        a = `{{lit-${String(Math.random()).slice(2)}}}`,
        o = `\x3c!--${a}--\x3e`,
        d = new RegExp(`${a}|${o}`),
        l = "$lit$";

  class h {
    constructor(e, t) {
      this.parts = [], this.element = t;
      const i = [],
            s = [],
            n = document.createTreeWalker(t.content, 133, null, !1);
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
        const e = n.nextNode();

        if (null !== e) {
          if (o++, 1 === e.nodeType) {
            if (e.hasAttributes()) {
              const t = e.attributes,
                    {
                length: i
              } = t;
              let s = 0;

              for (let e = 0; e < i; e++) u(t[e].name, l) && s++;

              for (; s-- > 0;) {
                const t = c[h],
                      i = _.exec(t)[2],
                      s = i.toLowerCase() + l,
                      n = e.getAttribute(s);

                e.removeAttribute(s);
                const r = n.split(d);
                this.parts.push({
                  type: "attribute",
                  index: o,
                  name: i,
                  strings: r
                }), h += r.length - 1;
              }
            }

            "TEMPLATE" === e.tagName && (s.push(e), n.currentNode = e.content);
          } else if (3 === e.nodeType) {
            const t = e.data;

            if (t.indexOf(a) >= 0) {
              const s = e.parentNode,
                    n = t.split(d),
                    r = n.length - 1;

              for (let t = 0; t < r; t++) {
                let i,
                    r = n[t];
                if ("" === r) i = f();else {
                  const e = _.exec(r);

                  null !== e && u(e[2], l) && (r = r.slice(0, e.index) + e[1] + e[2].slice(0, -l.length) + e[3]), i = document.createTextNode(r);
                }
                s.insertBefore(i, e), this.parts.push({
                  type: "node",
                  index: ++o
                });
              }

              "" === n[r] ? (s.insertBefore(f(), e), i.push(e)) : e.data = n[r], h += r;
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
        } else n.currentNode = s.pop();
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
            s = this.template.parts,
            n = document.createTreeWalker(e, 133, null, !1);
      let r,
          a = 0,
          o = 0,
          d = n.nextNode();

      for (; a < s.length;) if (r = s[a], c(r)) {
        for (; o < r.index;) o++, "TEMPLATE" === d.nodeName && (t.push(d), n.currentNode = d.content), null === (d = n.nextNode()) && (n.currentNode = t.pop(), d = n.nextNode());

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
    constructor(e, t, i, s) {
      this.strings = e, this.values = t, this.type = i, this.processor = s;
    }

    getHTML() {
      const e = this.strings.length - 1;
      let t = "",
          i = !1;

      for (let s = 0; s < e; s++) {
        const e = this.strings[s],
              n = e.lastIndexOf("\x3c!--");
        i = (n > -1 || i) && -1 === e.indexOf("--\x3e", n + 1);

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

      for (let s = 0; s < t; s++) {
        i += e[s];
        const t = this.parts[s];

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
      e === n || y(e) && e === this.value || (this.value = e, t(e) || (this.committer.dirty = !0));
    }

    commit() {
      for (; t(this.value);) {
        const e = this.value;
        this.value = n, e(this);
      }

      this.value !== n && this.committer.commit();
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
        this.__pendingValue = n, e(this);
      }

      const e = this.__pendingValue;
      e !== n && (y(e) ? e !== this.value && this.__commitText(e) : e instanceof p ? this.__commitTemplateResult(e) : e instanceof Node ? this.__commitNode(e) : g(e) ? this.__commitIterable(e) : e === r ? (this.value = r, this.clear()) : this.__commitText(e));
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
              s = i._clone();

        i.update(e.values), this.__commitNode(s), this.value = i;
      }
    }

    __commitIterable(e) {
      Array.isArray(this.value) || (this.value = [], this.clear());
      const t = this.value;
      let i,
          s = 0;

      for (const n of e) void 0 === (i = t[s]) && (i = new S(this.options), t.push(i), 0 === s ? i.appendIntoPart(this) : i.insertAfterPart(t[s - 1])), i.setValue(n), i.commit(), s++;

      s < t.length && (t.length = s, this.clear(i && i.endNode));
    }

    clear(e = this.startNode) {
      s(this.startNode.parentNode, e.nextSibling, this.endNode);
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
        this.__pendingValue = n, e(this);
      }

      if (this.__pendingValue === n) return;
      const e = !!this.__pendingValue;
      this.value !== e && (e ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name), this.value = e), this.__pendingValue = n;
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
        this.__pendingValue = n, e(this);
      }

      if (this.__pendingValue === n) return;
      const e = this.__pendingValue,
            i = this.value,
            s = null == e || null != i && (e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive),
            r = null != e && (null == i || s);
      s && this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options), r && (this.__options = O(e), this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)), this.value = e, this.__pendingValue = n;
    }

    handleEvent(e) {
      "function" == typeof this.value ? this.value.call(this.eventContext || this.element, e) : this.value.handleEvent(e);
    }

  }

  const O = e => e && (D ? {
    capture: e.capture,
    passive: e.passive,
    once: e.once
  } : e.capture);

  const Y = new class {
    handleAttributeExpressions(e, t, i, s) {
      const n = t[0];
      return "." === n ? new k(e, t.slice(1), i).parts : "@" === n ? [new x(e, t.slice(1), s.eventContext)] : "?" === n ? [new b(e, t.slice(1), i)] : new v(e, t, i).parts;
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
    const s = e.strings.join(a);
    return void 0 === (i = t.keyString.get(s)) && (i = new h(e, e.getTemplateElement()), t.keyString.set(s, i)), t.stringsArray.set(e.strings, i), i;
  }

  const P = new Map(),
        C = new WeakMap();
  (window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.0.0");

  const N = (e, ...t) => new p(e, t, "html", Y),
        F = 133;

  function W(e, t) {
    const {
      element: {
        content: i
      },
      parts: s
    } = e,
          n = document.createTreeWalker(i, F, null, !1);
    let r = j(s),
        a = s[r],
        o = -1,
        d = 0;
    const l = [];
    let h = null;

    for (; n.nextNode();) {
      o++;
      const e = n.currentNode;

      for (e.previousSibling === h && (h = null), t.has(e) && (l.push(e), null === h && (h = e)), null !== h && d++; void 0 !== a && a.index === o;) a.index = null !== h ? -1 : a.index - d, a = s[r = j(s, r)];
    }

    l.forEach(e => e.parentNode.removeChild(e));
  }

  const V = e => {
    let t = 11 === e.nodeType ? 0 : 1;
    const i = document.createTreeWalker(e, F, null, !1);

    for (; i.nextNode();) t++;

    return t;
  },
        j = (e, t = -1) => {
    for (let i = t + 1; i < e.length; i++) {
      const t = e[i];
      if (c(t)) return i;
    }

    return -1;
  };

  const E = (e, t) => `${e}--${t}`;

  let R = !0;
  void 0 === window.ShadyCSS ? R = !1 : void 0 === window.ShadyCSS.prepareTemplateDom && (console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."), R = !1);

  const U = e => t => {
    const i = E(t.type, e);
    let s = P.get(i);
    void 0 === s && (s = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    }, P.set(i, s));
    let n = s.stringsArray.get(t.strings);
    if (void 0 !== n) return n;
    const r = t.strings.join(a);

    if (void 0 === (n = s.keyString.get(r))) {
      const i = t.getTemplateElement();
      R && window.ShadyCSS.prepareTemplateDom(i, e), n = new h(t, i), s.keyString.set(r, n);
    }

    return s.stringsArray.set(t.strings, n), n;
  },
        A = ["html", "svg"],
        L = new Set(),
        H = (e, t, i) => {
    L.add(i);
    const s = e.querySelectorAll("style"),
          {
      length: n
    } = s;
    if (0 === n) return void window.ShadyCSS.prepareTemplateStyles(t.element, i);
    const r = document.createElement("style");

    for (let e = 0; e < n; e++) {
      const t = s[e];
      t.parentNode.removeChild(t), r.textContent += t.textContent;
    }

    (e => {
      A.forEach(t => {
        const i = P.get(E(t, e));
        void 0 !== i && i.keyString.forEach(e => {
          const {
            element: {
              content: t
            }
          } = e,
                i = new Set();
          Array.from(t.querySelectorAll("style")).forEach(e => {
            i.add(e);
          }), W(e, i);
        });
      });
    })(i);

    const a = t.element.content;
    !function (e, t, i = null) {
      const {
        element: {
          content: s
        },
        parts: n
      } = e;
      if (null == i) return void s.appendChild(t);
      const r = document.createTreeWalker(s, F, null, !1);
      let a = j(n),
          o = 0,
          d = -1;

      for (; r.nextNode();) for (d++, r.currentNode === i && (o = V(t), i.parentNode.insertBefore(t, i)); -1 !== a && n[a].index === d;) {
        if (o > 0) {
          for (; -1 !== a;) n[a].index += o, a = j(n, a);

          return;
        }

        a = j(n, a);
      }
    }(t, r, a.firstChild), window.ShadyCSS.prepareTemplateStyles(t.element, i);
    const o = a.querySelector("style");
    if (window.ShadyCSS.nativeShadow && null !== o) e.insertBefore(o.cloneNode(!0), e.firstChild);else {
      a.insertBefore(r, a.firstChild);
      const e = new Set();
      e.add(r), W(t, e);
    }
  };

  window.JSCompiler_renameProperty = (e, t) => e;

  const I = {
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
        G = (e, t) => t !== e && (t == t || e == e),
        $ = {
    attribute: !0,
    type: String,
    converter: I,
    reflect: !1,
    hasChanged: G
  },
        z = Promise.resolve(!0),
        Z = 1,
        q = 4,
        B = 8,
        J = 16,
        Q = 32;

  class X extends HTMLElement {
    constructor() {
      super(), this._updateState = 0, this._instanceProperties = void 0, this._updatePromise = z, this._hasConnectedResolver = void 0, this._changedProperties = new Map(), this._reflectingProperties = void 0, this.initialize();
    }

    static get observedAttributes() {
      this.finalize();
      const e = [];
      return this._classProperties.forEach((t, i) => {
        const s = this._attributeNameForProperty(i, t);

        void 0 !== s && (this._attributeToPropertyMap.set(s, i), e.push(s));
      }), e;
    }

    static _ensureClassProperties() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties", this))) {
        this._classProperties = new Map();

        const e = Object.getPrototypeOf(this)._classProperties;

        void 0 !== e && e.forEach((e, t) => this._classProperties.set(t, e));
      }
    }

    static createProperty(e, t = $) {
      if (this._ensureClassProperties(), this._classProperties.set(e, t), t.noAccessor || this.prototype.hasOwnProperty(e)) return;
      const i = "symbol" == typeof e ? Symbol() : `__${e}`;
      Object.defineProperty(this.prototype, e, {
        get() {
          return this[i];
        },

        set(t) {
          const s = this[e];
          this[i] = t, this._requestUpdate(e, s);
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

    static _valueHasChanged(e, t, i = G) {
      return i(e, t);
    }

    static _propertyValueFromAttribute(e, t) {
      const i = t.type,
            s = t.converter || I,
            n = "function" == typeof s ? s : s.fromAttribute;
      return n ? n(e, i) : e;
    }

    static _propertyValueToAttribute(e, t) {
      if (void 0 === t.reflect) return;
      const i = t.type,
            s = t.converter;
      return (s && s.toAttribute || I.toAttribute)(e, i);
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

    _propertyToAttribute(e, t, i = $) {
      const s = this.constructor,
            n = s._attributeNameForProperty(e, i);

      if (void 0 !== n) {
        const e = s._propertyValueToAttribute(t, i);

        if (void 0 === e) return;
        this._updateState = this._updateState | B, null == e ? this.removeAttribute(n) : this.setAttribute(n, e), this._updateState = this._updateState & ~B;
      }
    }

    _attributeToProperty(e, t) {
      if (this._updateState & B) return;

      const i = this.constructor,
            s = i._attributeToPropertyMap.get(e);

      if (void 0 !== s) {
        const e = i._classProperties.get(s) || $;
        this._updateState = this._updateState | J, this[s] = i._propertyValueFromAttribute(t, e), this._updateState = this._updateState & ~J;
      }
    }

    _requestUpdate(e, t) {
      let i = !0;

      if (void 0 !== e) {
        const s = this.constructor,
              n = s._classProperties.get(e) || $;
        s._valueHasChanged(this[e], t, n.hasChanged) ? (this._changedProperties.has(e) || this._changedProperties.set(e, t), !0 !== n.reflect || this._updateState & J || (void 0 === this._reflectingProperties && (this._reflectingProperties = new Map()), this._reflectingProperties.set(e, n))) : i = !1;
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
      this._updatePromise = new Promise((i, s) => {
        e = i, t = s;
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
    for (let s = 0, n = t.length; s < n; s++) {
      const n = t[s];
      Array.isArray(n) ? e(n, i) : i.push(n);
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

  var ie, se;

  function ne() {
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
        s = [];

    for (i = 0; i < e.length; ++i) s.push(t(e[i], i));

    return s;
  }

  function ue(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }

  function ce(e, t) {
    for (var i in t) ue(t, i) && (e[i] = t[i]);

    return ue(t, "toString") && (e.toString = t.toString), ue(t, "valueOf") && (e.valueOf = t.valueOf), e;
  }

  function fe(e, t, i, s) {
    return Pi(e, t, i, s, !0).utc();
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
          i = se.call(t.parsedDateParts, function (e) {
        return null != e;
      }),
          s = !isNaN(e._d.getTime()) && t.overflow < 0 && !t.empty && !t.invalidMonth && !t.invalidWeekday && !t.weekdayMismatch && !t.nullInput && !t.invalidFormat && !t.userInvalidated && (!t.meridiem || t.meridiem && i);

      if (e._strict && (s = s && 0 === t.charsLeftOver && 0 === t.unusedTokens.length && void 0 === t.bigHour), null != Object.isFrozen && Object.isFrozen(e)) return s;
      e._isValid = s;
    }

    return e._isValid;
  }

  function pe(e) {
    var t = fe(NaN);
    return null != e ? ce(_e(t), e) : _e(t).userInvalidated = !0, t;
  }

  te.finalized = !0, te.render = (e, t, i) => {
    const n = i.scopeName,
          r = C.has(t),
          a = R && 11 === t.nodeType && !!t.host && e instanceof p,
          o = a && !L.has(n),
          d = o ? document.createDocumentFragment() : t;

    if (((e, t, i) => {
      let n = C.get(t);
      void 0 === n && (s(t, t.firstChild), C.set(t, n = new S(Object.assign({
        templateFactory: T
      }, i))), n.appendInto(t)), n.setValue(e), n.commit();
    })(e, d, Object.assign({
      templateFactory: U(n)
    }, i)), o) {
      const e = C.get(d);
      C.delete(d), e.value instanceof m && H(d, e.value.template, n), s(t, t.firstChild), t.appendChild(d), C.set(t, e);
    }

    !r && a && window.ShadyCSS.styleElement(t.host);
  }, se = Array.prototype.some ? Array.prototype.some : function (e) {
    for (var t = Object(this), i = t.length >>> 0, s = 0; s < i; s++) if (s in t && e.call(this, t[s], s, t)) return !0;

    return !1;
  };
  var ye = ne.momentProperties = [];

  function ge(e, t) {
    var i, s, n;
    if (oe(t._isAMomentObject) || (e._isAMomentObject = t._isAMomentObject), oe(t._i) || (e._i = t._i), oe(t._f) || (e._f = t._f), oe(t._l) || (e._l = t._l), oe(t._strict) || (e._strict = t._strict), oe(t._tzm) || (e._tzm = t._tzm), oe(t._isUTC) || (e._isUTC = t._isUTC), oe(t._offset) || (e._offset = t._offset), oe(t._pf) || (e._pf = _e(t)), oe(t._locale) || (e._locale = t._locale), ye.length > 0) for (i = 0; i < ye.length; i++) oe(n = t[s = ye[i]]) || (e[s] = n);
    return e;
  }

  var ve = !1;

  function we(e) {
    ge(this, e), this._d = new Date(null != e._d ? e._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 === ve && (ve = !0, ne.updateOffset(this), ve = !1);
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
    var s,
        n = Math.min(e.length, t.length),
        r = Math.abs(e.length - t.length),
        a = 0;

    for (s = 0; s < n; s++) (i && e[s] !== t[s] || !i && ke(e[s]) !== ke(t[s])) && a++;

    return a + r;
  }

  function De(e) {
    !1 === ne.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + e);
  }

  function xe(e, t) {
    var i = !0;
    return ce(function () {
      if (null != ne.deprecationHandler && ne.deprecationHandler(null, e), i) {
        for (var s, n = [], r = 0; r < arguments.length; r++) {
          if (s = "", "object" == typeof arguments[r]) {
            for (var a in s += "\n[" + r + "] ", arguments[0]) s += a + ": " + arguments[0][a] + ", ";

            s = s.slice(0, -2);
          } else s = arguments[r];

          n.push(s);
        }

        De(e + "\nArguments: " + Array.prototype.slice.call(n).join("") + "\n" + new Error().stack), i = !1;
      }

      return t.apply(this, arguments);
    }, t);
  }

  var Oe,
      Ye = {};

  function Te(e, t) {
    null != ne.deprecationHandler && ne.deprecationHandler(e, t), Ye[e] || (De(t), Ye[e] = !0);
  }

  function Pe(e) {
    return e instanceof Function || "[object Function]" === Object.prototype.toString.call(e);
  }

  function Ce(e, t) {
    var i,
        s = ce({}, e);

    for (i in t) ue(t, i) && (ae(e[i]) && ae(t[i]) ? (s[i] = {}, ce(s[i], e[i]), ce(s[i], t[i])) : null != t[i] ? s[i] = t[i] : delete s[i]);

    for (i in e) ue(e, i) && !ue(t, i) && ae(e[i]) && (s[i] = ce({}, s[i]));

    return s;
  }

  function Ne(e) {
    null != e && this.set(e);
  }

  ne.suppressDeprecationWarnings = !1, ne.deprecationHandler = null, Oe = Object.keys ? Object.keys : function (e) {
    var t,
        i = [];

    for (t in e) ue(e, t) && i.push(t);

    return i;
  };
  var Fe = {};

  function We(e, t) {
    var i = e.toLowerCase();
    Fe[i] = Fe[i + "s"] = Fe[t] = e;
  }

  function Ve(e) {
    return "string" == typeof e ? Fe[e] || Fe[e.toLowerCase()] : void 0;
  }

  function je(e) {
    var t,
        i,
        s = {};

    for (i in e) ue(e, i) && (t = Ve(i)) && (s[t] = e[i]);

    return s;
  }

  var Ee = {};

  function Re(e, t) {
    Ee[e] = t;
  }

  function Ue(e, t, i) {
    var s = "" + Math.abs(e),
        n = t - s.length;
    return (e >= 0 ? i ? "+" : "" : "-") + Math.pow(10, Math.max(0, n)).toString().substr(1) + s;
  }

  var Ae = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
      Le = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
      He = {},
      Ie = {};

  function Ge(e, t, i, s) {
    var n = s;
    "string" == typeof s && (n = function () {
      return this[s]();
    }), e && (Ie[e] = n), t && (Ie[t[0]] = function () {
      return Ue(n.apply(this, arguments), t[1], t[2]);
    }), i && (Ie[i] = function () {
      return this.localeData().ordinal(n.apply(this, arguments), e);
    });
  }

  function $e(e, t) {
    return e.isValid() ? (t = ze(t, e.localeData()), He[t] = He[t] || function (e) {
      var t,
          i,
          s,
          n = e.match(Ae);

      for (t = 0, i = n.length; t < i; t++) Ie[n[t]] ? n[t] = Ie[n[t]] : n[t] = (s = n[t]).match(/\[[\s\S]/) ? s.replace(/^\[|\]$/g, "") : s.replace(/\\/g, "");

      return function (t) {
        var s,
            r = "";

        for (s = 0; s < i; s++) r += Pe(n[s]) ? n[s].call(t, e) : n[s];

        return r;
      };
    }(t), He[t](e)) : e.localeData().invalidDate();
  }

  function ze(e, t) {
    var i = 5;

    function s(e) {
      return t.longDateFormat(e) || e;
    }

    for (Le.lastIndex = 0; i >= 0 && Le.test(e);) e = e.replace(Le, s), Le.lastIndex = 0, i -= 1;

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
      st = /[+-]?\d{1,6}/,
      nt = /\d+/,
      rt = /[+-]?\d+/,
      at = /Z|[+-]\d\d:?\d\d/gi,
      ot = /Z|[+-]\d\d(?::?\d\d)?/gi,
      dt = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
      lt = {};

  function ht(e, t, i) {
    lt[e] = Pe(t) ? t : function (e, s) {
      return e && i ? i : t;
    };
  }

  function ut(e, t) {
    return ue(lt, e) ? lt[e](t._strict, t._locale) : new RegExp(ct(e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (e, t, i, s, n) {
      return t || i || s || n;
    })));
  }

  function ct(e) {
    return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  var ft = {};

  function _t(e, t) {
    var i,
        s = t;

    for ("string" == typeof e && (e = [e]), de(t) && (s = function (e, i) {
      i[t] = ke(e);
    }), i = 0; i < e.length; i++) ft[e[i]] = s;
  }

  function mt(e, t) {
    _t(e, function (e, i, s, n) {
      s._w = s._w || {}, t(e, s._w, s, n);
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
    return Ot(e) ? 366 : 365;
  }

  function Ot(e) {
    return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
  }

  Ge("Y", 0, 0, function () {
    var e = this.year();
    return e <= 9999 ? "" + e : "+" + e;
  }), Ge(0, ["YY", 2], 0, function () {
    return this.year() % 100;
  }), Ge(0, ["YYYY", 4], 0, "year"), Ge(0, ["YYYYY", 5], 0, "year"), Ge(0, ["YYYYYY", 6, !0], 0, "year"), We("year", "y"), Re("year", 1), ht("Y", rt), ht("YY", Xe, qe), ht("YYYY", it, Je), ht("YYYYY", st, Qe), ht("YYYYYY", st, Qe), _t(["YYYYY", "YYYYYY"], yt), _t("YYYY", function (e, t) {
    t[yt] = 2 === e.length ? ne.parseTwoDigitYear(e) : ke(e);
  }), _t("YY", function (e, t) {
    t[yt] = ne.parseTwoDigitYear(e);
  }), _t("Y", function (e, t) {
    t[yt] = parseInt(e, 10);
  }), ne.parseTwoDigitYear = function (e) {
    return ke(e) + (ke(e) > 68 ? 1900 : 2e3);
  };
  var Yt,
      Tt = Pt("FullYear", !0);

  function Pt(e, t) {
    return function (i) {
      return null != i ? (Nt(this, e, i), ne.updateOffset(this, t), this) : Ct(this, e);
    };
  }

  function Ct(e, t) {
    return e.isValid() ? e._d["get" + (e._isUTC ? "UTC" : "") + t]() : NaN;
  }

  function Nt(e, t, i) {
    e.isValid() && !isNaN(i) && ("FullYear" === t && Ot(e.year()) && 1 === e.month() && 29 === e.date() ? e._d["set" + (e._isUTC ? "UTC" : "") + t](i, e.month(), Ft(i, e.month())) : e._d["set" + (e._isUTC ? "UTC" : "") + t](i));
  }

  function Ft(e, t) {
    if (isNaN(e) || isNaN(t)) return NaN;
    var i,
        s = (t % (i = 12) + i) % i;
    return e += (t - s) / 12, 1 === s ? Ot(e) ? 29 : 28 : 31 - s % 7 % 2;
  }

  Yt = Array.prototype.indexOf ? Array.prototype.indexOf : function (e) {
    var t;

    for (t = 0; t < this.length; ++t) if (this[t] === e) return t;

    return -1;
  }, Ge("M", ["MM", 2], "Mo", function () {
    return this.month() + 1;
  }), Ge("MMM", 0, 0, function (e) {
    return this.localeData().monthsShort(this, e);
  }), Ge("MMMM", 0, 0, function (e) {
    return this.localeData().months(this, e);
  }), We("month", "M"), Re("month", 8), ht("M", Xe), ht("MM", Xe, qe), ht("MMM", function (e, t) {
    return t.monthsShortRegex(e);
  }), ht("MMMM", function (e, t) {
    return t.monthsRegex(e);
  }), _t(["M", "MM"], function (e, t) {
    t[gt] = ke(e) - 1;
  }), _t(["MMM", "MMMM"], function (e, t, i, s) {
    var n = i._locale.monthsParse(e, s, i._strict);

    null != n ? t[gt] = n : _e(i).invalidMonth = e;
  });
  var Wt = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
      Vt = "January_February_March_April_May_June_July_August_September_October_November_December".split("_");
  var jt = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");

  function Et(e, t) {
    var i;
    if (!e.isValid()) return e;
    if ("string" == typeof t) if (/^\d+$/.test(t)) t = ke(t);else if (!de(t = e.localeData().monthsParse(t))) return e;
    return i = Math.min(e.date(), Ft(e.year(), t)), e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, i), e;
  }

  function Rt(e) {
    return null != e ? (Et(this, e), ne.updateOffset(this, !0), this) : Ct(this, "Month");
  }

  var Ut = dt;
  var At = dt;

  function Lt() {
    function e(e, t) {
      return t.length - e.length;
    }

    var t,
        i,
        s = [],
        n = [],
        r = [];

    for (t = 0; t < 12; t++) i = fe([2e3, t]), s.push(this.monthsShort(i, "")), n.push(this.months(i, "")), r.push(this.months(i, "")), r.push(this.monthsShort(i, ""));

    for (s.sort(e), n.sort(e), r.sort(e), t = 0; t < 12; t++) s[t] = ct(s[t]), n[t] = ct(n[t]);

    for (t = 0; t < 24; t++) r[t] = ct(r[t]);

    this._monthsRegex = new RegExp("^(" + r.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = new RegExp("^(" + n.join("|") + ")", "i"), this._monthsShortStrictRegex = new RegExp("^(" + s.join("|") + ")", "i");
  }

  function Ht(e) {
    var t;

    if (e < 100 && e >= 0) {
      var i = Array.prototype.slice.call(arguments);
      i[0] = e + 400, t = new Date(Date.UTC.apply(null, i)), isFinite(t.getUTCFullYear()) && t.setUTCFullYear(e);
    } else t = new Date(Date.UTC.apply(null, arguments));

    return t;
  }

  function It(e, t, i) {
    var s = 7 + t - i;
    return -((7 + Ht(e, 0, s).getUTCDay() - t) % 7) + s - 1;
  }

  function Gt(e, t, i, s, n) {
    var r,
        a,
        o = 1 + 7 * (t - 1) + (7 + i - s) % 7 + It(e, s, n);
    return o <= 0 ? a = xt(r = e - 1) + o : o > xt(e) ? (r = e + 1, a = o - xt(e)) : (r = e, a = o), {
      year: r,
      dayOfYear: a
    };
  }

  function $t(e, t, i) {
    var s,
        n,
        r = It(e.year(), t, i),
        a = Math.floor((e.dayOfYear() - r - 1) / 7) + 1;
    return a < 1 ? s = a + zt(n = e.year() - 1, t, i) : a > zt(e.year(), t, i) ? (s = a - zt(e.year(), t, i), n = e.year() + 1) : (n = e.year(), s = a), {
      week: s,
      year: n
    };
  }

  function zt(e, t, i) {
    var s = It(e, t, i),
        n = It(e + 1, t, i);
    return (xt(e) - s + n) / 7;
  }

  Ge("w", ["ww", 2], "wo", "week"), Ge("W", ["WW", 2], "Wo", "isoWeek"), We("week", "w"), We("isoWeek", "W"), Re("week", 5), Re("isoWeek", 5), ht("w", Xe), ht("ww", Xe, qe), ht("W", Xe), ht("WW", Xe, qe), mt(["w", "ww", "W", "WW"], function (e, t, i, s) {
    t[s.substr(0, 1)] = ke(e);
  });

  function Zt(e, t) {
    return e.slice(t, 7).concat(e.slice(0, t));
  }

  Ge("d", 0, "do", "day"), Ge("dd", 0, 0, function (e) {
    return this.localeData().weekdaysMin(this, e);
  }), Ge("ddd", 0, 0, function (e) {
    return this.localeData().weekdaysShort(this, e);
  }), Ge("dddd", 0, 0, function (e) {
    return this.localeData().weekdays(this, e);
  }), Ge("e", 0, 0, "weekday"), Ge("E", 0, 0, "isoWeekday"), We("day", "d"), We("weekday", "e"), We("isoWeekday", "E"), Re("day", 11), Re("weekday", 11), Re("isoWeekday", 11), ht("d", Xe), ht("e", Xe), ht("E", Xe), ht("dd", function (e, t) {
    return t.weekdaysMinRegex(e);
  }), ht("ddd", function (e, t) {
    return t.weekdaysShortRegex(e);
  }), ht("dddd", function (e, t) {
    return t.weekdaysRegex(e);
  }), mt(["dd", "ddd", "dddd"], function (e, t, i, s) {
    var n = i._locale.weekdaysParse(e, s, i._strict);

    null != n ? t.d = n : _e(i).invalidWeekday = e;
  }), mt(["d", "e", "E"], function (e, t, i, s) {
    t[s] = ke(e);
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
        s,
        n,
        r,
        a = [],
        o = [],
        d = [],
        l = [];

    for (t = 0; t < 7; t++) i = fe([2e3, 1]).day(t), s = this.weekdaysMin(i, ""), n = this.weekdaysShort(i, ""), r = this.weekdays(i, ""), a.push(s), o.push(n), d.push(r), l.push(s), l.push(n), l.push(r);

    for (a.sort(e), o.sort(e), d.sort(e), l.sort(e), t = 0; t < 7; t++) o[t] = ct(o[t]), d[t] = ct(d[t]), l[t] = ct(l[t]);

    this._weekdaysRegex = new RegExp("^(" + l.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp("^(" + d.join("|") + ")", "i"), this._weekdaysShortStrictRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._weekdaysMinStrictRegex = new RegExp("^(" + a.join("|") + ")", "i");
  }

  function ti() {
    return this.hours() % 12 || 12;
  }

  function ii(e, t) {
    Ge(e, 0, 0, function () {
      return this.localeData().meridiem(this.hours(), this.minutes(), t);
    });
  }

  function si(e, t) {
    return t._meridiemParse;
  }

  Ge("H", ["HH", 2], 0, "hour"), Ge("h", ["hh", 2], 0, ti), Ge("k", ["kk", 2], 0, function () {
    return this.hours() || 24;
  }), Ge("hmm", 0, 0, function () {
    return "" + ti.apply(this) + Ue(this.minutes(), 2);
  }), Ge("hmmss", 0, 0, function () {
    return "" + ti.apply(this) + Ue(this.minutes(), 2) + Ue(this.seconds(), 2);
  }), Ge("Hmm", 0, 0, function () {
    return "" + this.hours() + Ue(this.minutes(), 2);
  }), Ge("Hmmss", 0, 0, function () {
    return "" + this.hours() + Ue(this.minutes(), 2) + Ue(this.seconds(), 2);
  }), ii("a", !0), ii("A", !1), We("hour", "h"), Re("hour", 13), ht("a", si), ht("A", si), ht("H", Xe), ht("h", Xe), ht("k", Xe), ht("HH", Xe, qe), ht("hh", Xe, qe), ht("kk", Xe, qe), ht("hmm", Ke), ht("hmmss", et), ht("Hmm", Ke), ht("Hmmss", et), _t(["H", "HH"], wt), _t(["k", "kk"], function (e, t, i) {
    var s = ke(e);
    t[wt] = 24 === s ? 0 : s;
  }), _t(["a", "A"], function (e, t, i) {
    i._isPm = i._locale.isPM(e), i._meridiem = e;
  }), _t(["h", "hh"], function (e, t, i) {
    t[wt] = ke(e), _e(i).bigHour = !0;
  }), _t("hmm", function (e, t, i) {
    var s = e.length - 2;
    t[wt] = ke(e.substr(0, s)), t[St] = ke(e.substr(s)), _e(i).bigHour = !0;
  }), _t("hmmss", function (e, t, i) {
    var s = e.length - 4,
        n = e.length - 2;
    t[wt] = ke(e.substr(0, s)), t[St] = ke(e.substr(s, 2)), t[bt] = ke(e.substr(n)), _e(i).bigHour = !0;
  }), _t("Hmm", function (e, t, i) {
    var s = e.length - 2;
    t[wt] = ke(e.substr(0, s)), t[St] = ke(e.substr(s));
  }), _t("Hmmss", function (e, t, i) {
    var s = e.length - 4,
        n = e.length - 2;
    t[wt] = ke(e.substr(0, s)), t[St] = ke(e.substr(s, 2)), t[bt] = ke(e.substr(n));
  });
  var ni,
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
    months: Vt,
    monthsShort: jt,
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
      t = ni._abbr, require("./locale/" + e), ui(t);
    } catch (e) {}
    return oi[e];
  }

  function ui(e, t) {
    var i;
    return e && ((i = oe(t) ? fi(e) : ci(e, t)) ? ni = i : "undefined" != typeof console && console.warn && console.warn("Locale " + e + " not found. Did you forget to load it?")), ni._abbr;
  }

  function ci(e, t) {
    if (null !== t) {
      var i,
          s = ai;
      if (t.abbr = e, null != oi[e]) Te("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), s = oi[e]._config;else if (null != t.parentLocale) if (null != oi[t.parentLocale]) s = oi[t.parentLocale]._config;else {
        if (null == (i = hi(t.parentLocale))) return di[t.parentLocale] || (di[t.parentLocale] = []), di[t.parentLocale].push({
          name: e,
          config: t
        }), null;
        s = i._config;
      }
      return oi[e] = new Ne(Ce(s, t)), di[e] && di[e].forEach(function (e) {
        ci(e.name, e.config);
      }), ui(e), oi[e];
    }

    return delete oi[e], null;
  }

  function fi(e) {
    var t;
    if (e && e._locale && e._locale._abbr && (e = e._locale._abbr), !e) return ni;

    if (!re(e)) {
      if (t = hi(e)) return t;
      e = [e];
    }

    return function (e) {
      for (var t, i, s, n, r = 0; r < e.length;) {
        for (t = (n = li(e[r]).split("-")).length, i = (i = li(e[r + 1])) ? i.split("-") : null; t > 0;) {
          if (s = hi(n.slice(0, t).join("-"))) return s;
          if (i && i.length >= t && Me(n, i, !0) >= t - 1) break;
          t--;
        }

        r++;
      }

      return ni;
    }(e);
  }

  function _i(e) {
    var t,
        i = e._a;
    return i && -2 === _e(e).overflow && (t = i[gt] < 0 || i[gt] > 11 ? gt : i[vt] < 1 || i[vt] > Ft(i[yt], i[gt]) ? vt : i[wt] < 0 || i[wt] > 24 || 24 === i[wt] && (0 !== i[St] || 0 !== i[bt] || 0 !== i[kt]) ? wt : i[St] < 0 || i[St] > 59 ? St : i[bt] < 0 || i[bt] > 59 ? bt : i[kt] < 0 || i[kt] > 999 ? kt : -1, _e(e)._overflowDayOfYear && (t < yt || t > vt) && (t = vt), _e(e)._overflowWeeks && -1 === t && (t = Mt), _e(e)._overflowWeekday && -1 === t && (t = Dt), _e(e).overflow = t), e;
  }

  function mi(e, t, i) {
    return null != e ? e : null != t ? t : i;
  }

  function pi(e) {
    var t,
        i,
        s,
        n,
        r,
        a = [];

    if (!e._d) {
      for (s = function (e) {
        var t = new Date(ne.now());
        return e._useUTC ? [t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()] : [t.getFullYear(), t.getMonth(), t.getDate()];
      }(e), e._w && null == e._a[vt] && null == e._a[gt] && function (e) {
        var t, i, s, n, r, a, o, d;
        if (null != (t = e._w).GG || null != t.W || null != t.E) r = 1, a = 4, i = mi(t.GG, e._a[yt], $t(Ci(), 1, 4).year), s = mi(t.W, 1), ((n = mi(t.E, 1)) < 1 || n > 7) && (d = !0);else {
          r = e._locale._week.dow, a = e._locale._week.doy;
          var l = $t(Ci(), r, a);
          i = mi(t.gg, e._a[yt], l.year), s = mi(t.w, l.week), null != t.d ? ((n = t.d) < 0 || n > 6) && (d = !0) : null != t.e ? (n = t.e + r, (t.e < 0 || t.e > 6) && (d = !0)) : n = r;
        }
        s < 1 || s > zt(i, r, a) ? _e(e)._overflowWeeks = !0 : null != d ? _e(e)._overflowWeekday = !0 : (o = Gt(i, s, n, r, a), e._a[yt] = o.year, e._dayOfYear = o.dayOfYear);
      }(e), null != e._dayOfYear && (r = mi(e._a[yt], s[yt]), (e._dayOfYear > xt(r) || 0 === e._dayOfYear) && (_e(e)._overflowDayOfYear = !0), i = Ht(r, 0, e._dayOfYear), e._a[gt] = i.getUTCMonth(), e._a[vt] = i.getUTCDate()), t = 0; t < 3 && null == e._a[t]; ++t) e._a[t] = a[t] = s[t];

      for (; t < 7; t++) e._a[t] = a[t] = null == e._a[t] ? 2 === t ? 1 : 0 : e._a[t];

      24 === e._a[wt] && 0 === e._a[St] && 0 === e._a[bt] && 0 === e._a[kt] && (e._nextDay = !0, e._a[wt] = 0), e._d = (e._useUTC ? Ht : function (e, t, i, s, n, r, a) {
        var o;
        return e < 100 && e >= 0 ? (o = new Date(e + 400, t, i, s, n, r, a), isFinite(o.getFullYear()) && o.setFullYear(e)) : o = new Date(e, t, i, s, n, r, a), o;
      }).apply(null, a), n = e._useUTC ? e._d.getUTCDay() : e._d.getDay(), null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), e._nextDay && (e._a[wt] = 24), e._w && void 0 !== e._w.d && e._w.d !== n && (_e(e).weekdayMismatch = !0);
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
        s,
        n,
        r,
        a,
        o = e._i,
        d = yi.exec(o) || gi.exec(o);

    if (d) {
      for (_e(e).iso = !0, t = 0, i = wi.length; t < i; t++) if (wi[t][1].exec(d[1])) {
        n = wi[t][0], s = !1 !== wi[t][2];
        break;
      }

      if (null == n) return void (e._isValid = !1);

      if (d[3]) {
        for (t = 0, i = Si.length; t < i; t++) if (Si[t][1].exec(d[3])) {
          r = (d[2] || " ") + Si[t][0];
          break;
        }

        if (null == r) return void (e._isValid = !1);
      }

      if (!s && null != r) return void (e._isValid = !1);

      if (d[4]) {
        if (!vi.exec(d[4])) return void (e._isValid = !1);
        a = "Z";
      }

      e._f = n + (r || "") + (a || ""), Yi(e);
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

  function Oi(e) {
    var t,
        i,
        s,
        n,
        r,
        a,
        o,
        d = Mi.exec(e._i.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, ""));

    if (d) {
      var l = (t = d[4], i = d[3], s = d[2], n = d[5], r = d[6], a = d[7], o = [Di(t), jt.indexOf(i), parseInt(s, 10), parseInt(n, 10), parseInt(r, 10)], a && o.push(parseInt(a, 10)), o);
      if (!function (e, t, i) {
        return !e || Bt.indexOf(e) === new Date(t[0], t[1], t[2]).getDay() || (_e(i).weekdayMismatch = !0, i._isValid = !1, !1);
      }(d[1], l, e)) return;
      e._a = l, e._tzm = function (e, t, i) {
        if (e) return xi[e];
        if (t) return 0;
        var s = parseInt(i, 10),
            n = s % 100;
        return (s - n) / 100 * 60 + n;
      }(d[8], d[9], d[10]), e._d = Ht.apply(null, e._a), e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), _e(e).rfc2822 = !0;
    } else e._isValid = !1;
  }

  function Yi(e) {
    if (e._f !== ne.ISO_8601) {
      if (e._f !== ne.RFC_2822) {
        e._a = [], _e(e).empty = !0;
        var t,
            i,
            s,
            n,
            r,
            a = "" + e._i,
            o = a.length,
            d = 0;

        for (s = ze(e._f, e._locale).match(Ae) || [], t = 0; t < s.length; t++) n = s[t], (i = (a.match(ut(n, e)) || [])[0]) && ((r = a.substr(0, a.indexOf(i))).length > 0 && _e(e).unusedInput.push(r), a = a.slice(a.indexOf(i) + i.length), d += i.length), Ie[n] ? (i ? _e(e).empty = !1 : _e(e).unusedTokens.push(n), pt(n, i, e)) : e._strict && !i && _e(e).unusedTokens.push(n);

        _e(e).charsLeftOver = o - d, a.length > 0 && _e(e).unusedInput.push(a), e._a[wt] <= 12 && !0 === _e(e).bigHour && e._a[wt] > 0 && (_e(e).bigHour = void 0), _e(e).parsedDateParts = e._a.slice(0), _e(e).meridiem = e._meridiem, e._a[wt] = function (e, t, i) {
          var s;
          if (null == i) return t;
          return null != e.meridiemHour ? e.meridiemHour(t, i) : null != e.isPM ? ((s = e.isPM(i)) && t < 12 && (t += 12), s || 12 !== t || (t = 0), t) : t;
        }(e._locale, e._a[wt], e._meridiem), pi(e), _i(e);
      } else Oi(e);
    } else ki(e);
  }

  function Ti(e) {
    var t = e._i,
        i = e._f;
    return e._locale = e._locale || fi(e._l), null === t || void 0 === i && "" === t ? pe({
      nullInput: !0
    }) : ("string" == typeof t && (e._i = t = e._locale.preparse(t)), Se(t) ? new we(_i(t)) : (le(t) ? e._d = t : re(i) ? function (e) {
      var t, i, s, n, r;
      if (0 === e._f.length) return _e(e).invalidFormat = !0, void (e._d = new Date(NaN));

      for (n = 0; n < e._f.length; n++) r = 0, t = ge({}, e), null != e._useUTC && (t._useUTC = e._useUTC), t._f = e._f[n], Yi(t), me(t) && (r += _e(t).charsLeftOver, r += 10 * _e(t).unusedTokens.length, _e(t).score = r, (null == s || r < s) && (s = r, i = t));

      ce(e, i || t);
    }(e) : i ? Yi(e) : function (e) {
      var t = e._i;
      oe(t) ? e._d = new Date(ne.now()) : le(t) ? e._d = new Date(t.valueOf()) : "string" == typeof t ? function (e) {
        var t = bi.exec(e._i);
        null === t ? (ki(e), !1 === e._isValid && (delete e._isValid, Oi(e), !1 === e._isValid && (delete e._isValid, ne.createFromInputFallback(e)))) : e._d = new Date(+t[1]);
      }(e) : re(t) ? (e._a = he(t.slice(0), function (e) {
        return parseInt(e, 10);
      }), pi(e)) : ae(t) ? function (e) {
        if (!e._d) {
          var t = je(e._i);
          e._a = he([t.year, t.month, t.day || t.date, t.hour, t.minute, t.second, t.millisecond], function (e) {
            return e && parseInt(e, 10);
          }), pi(e);
        }
      }(e) : de(t) ? e._d = new Date(t) : ne.createFromInputFallback(e);
    }(e), me(e) || (e._d = null), e));
  }

  function Pi(e, t, i, s, n) {
    var r,
        a = {};
    return !0 !== i && !1 !== i || (s = i, i = void 0), (ae(e) && function (e) {
      if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(e).length;
      var t;

      for (t in e) if (e.hasOwnProperty(t)) return !1;

      return !0;
    }(e) || re(e) && 0 === e.length) && (e = void 0), a._isAMomentObject = !0, a._useUTC = a._isUTC = n, a._l = i, a._i = e, a._f = t, a._strict = s, (r = new we(_i(Ti(a))))._nextDay && (r.add(1, "d"), r._nextDay = void 0), r;
  }

  function Ci(e, t, i, s) {
    return Pi(e, t, i, s, !1);
  }

  ne.createFromInputFallback = xe("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function (e) {
    e._d = new Date(e._i + (e._useUTC ? " UTC" : ""));
  }), ne.ISO_8601 = function () {}, ne.RFC_2822 = function () {};
  var Ni = xe("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
    var e = Ci.apply(null, arguments);
    return this.isValid() && e.isValid() ? e < this ? this : e : pe();
  }),
      Fi = xe("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
    var e = Ci.apply(null, arguments);
    return this.isValid() && e.isValid() ? e > this ? this : e : pe();
  });

  function Wi(e, t) {
    var i, s;
    if (1 === t.length && re(t[0]) && (t = t[0]), !t.length) return Ci();

    for (i = t[0], s = 1; s < t.length; ++s) t[s].isValid() && !t[s][e](i) || (i = t[s]);

    return i;
  }

  var Vi = ["year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond"];

  function ji(e) {
    var t = je(e),
        i = t.year || 0,
        s = t.quarter || 0,
        n = t.month || 0,
        r = t.week || t.isoWeek || 0,
        a = t.day || 0,
        o = t.hour || 0,
        d = t.minute || 0,
        l = t.second || 0,
        h = t.millisecond || 0;
    this._isValid = function (e) {
      for (var t in e) if (-1 === Yt.call(Vi, t) || null != e[t] && isNaN(e[t])) return !1;

      for (var i = !1, s = 0; s < Vi.length; ++s) if (e[Vi[s]]) {
        if (i) return !1;
        parseFloat(e[Vi[s]]) !== ke(e[Vi[s]]) && (i = !0);
      }

      return !0;
    }(t), this._milliseconds = +h + 1e3 * l + 6e4 * d + 1e3 * o * 60 * 60, this._days = +a + 7 * r, this._months = +n + 3 * s + 12 * i, this._data = {}, this._locale = fi(), this._bubble();
  }

  function Ei(e) {
    return e instanceof ji;
  }

  function Ri(e) {
    return e < 0 ? -1 * Math.round(-1 * e) : Math.round(e);
  }

  function Ui(e, t) {
    Ge(e, 0, 0, function () {
      var e = this.utcOffset(),
          i = "+";
      return e < 0 && (e = -e, i = "-"), i + Ue(~~(e / 60), 2) + t + Ue(~~e % 60, 2);
    });
  }

  Ui("Z", ":"), Ui("ZZ", ""), ht("Z", ot), ht("ZZ", ot), _t(["Z", "ZZ"], function (e, t, i) {
    i._useUTC = !0, i._tzm = Li(ot, e);
  });
  var Ai = /([\+\-]|\d\d)/gi;

  function Li(e, t) {
    var i = (t || "").match(e);
    if (null === i) return null;
    var s = ((i[i.length - 1] || []) + "").match(Ai) || ["-", 0, 0],
        n = 60 * s[1] + ke(s[2]);
    return 0 === n ? 0 : "+" === s[0] ? n : -n;
  }

  function Hi(e, t) {
    var i, s;
    return t._isUTC ? (i = t.clone(), s = (Se(e) || le(e) ? e.valueOf() : Ci(e).valueOf()) - i.valueOf(), i._d.setTime(i._d.valueOf() + s), ne.updateOffset(i, !1), i) : Ci(e).local();
  }

  function Ii(e) {
    return 15 * -Math.round(e._d.getTimezoneOffset() / 15);
  }

  function Gi() {
    return !!this.isValid() && this._isUTC && 0 === this._offset;
  }

  ne.updateOffset = function () {};

  var $i = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,
      zi = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

  function Zi(e, t) {
    var i,
        s,
        n,
        r = e,
        a = null;
    return Ei(e) ? r = {
      ms: e._milliseconds,
      d: e._days,
      M: e._months
    } : de(e) ? (r = {}, t ? r[t] = e : r.milliseconds = e) : (a = $i.exec(e)) ? (i = "-" === a[1] ? -1 : 1, r = {
      y: 0,
      d: ke(a[vt]) * i,
      h: ke(a[wt]) * i,
      m: ke(a[St]) * i,
      s: ke(a[bt]) * i,
      ms: ke(Ri(1e3 * a[kt])) * i
    }) : (a = zi.exec(e)) ? (i = "-" === a[1] ? -1 : 1, r = {
      y: qi(a[2], i),
      M: qi(a[3], i),
      w: qi(a[4], i),
      d: qi(a[5], i),
      h: qi(a[6], i),
      m: qi(a[7], i),
      s: qi(a[8], i)
    }) : null == r ? r = {} : "object" == typeof r && ("from" in r || "to" in r) && (n = function (e, t) {
      var i;
      if (!e.isValid() || !t.isValid()) return {
        milliseconds: 0,
        months: 0
      };
      t = Hi(t, e), e.isBefore(t) ? i = Bi(e, t) : ((i = Bi(t, e)).milliseconds = -i.milliseconds, i.months = -i.months);
      return i;
    }(Ci(r.from), Ci(r.to)), (r = {}).ms = n.milliseconds, r.M = n.months), s = new ji(r), Ei(e) && ue(e, "_locale") && (s._locale = e._locale), s;
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
    return function (i, s) {
      var n;
      return null === s || isNaN(+s) || (Te(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), n = i, i = s, s = n), Qi(this, Zi(i = "string" == typeof i ? +i : i, s), e), this;
    };
  }

  function Qi(e, t, i, s) {
    var n = t._milliseconds,
        r = Ri(t._days),
        a = Ri(t._months);
    e.isValid() && (s = null == s || s, a && Et(e, Ct(e, "Month") + a * i), r && Nt(e, "Date", Ct(e, "Date") + r * i), n && e._d.setTime(e._d.valueOf() + n * i), s && ne.updateOffset(e, r || a));
  }

  Zi.fn = ji.prototype, Zi.invalid = function () {
    return Zi(NaN);
  };
  var Xi = Ji(1, "add"),
      Ki = Ji(-1, "subtract");

  function es(e, t) {
    var i = 12 * (t.year() - e.year()) + (t.month() - e.month()),
        s = e.clone().add(i, "months");
    return -(i + (t - s < 0 ? (t - s) / (s - e.clone().add(i - 1, "months")) : (t - s) / (e.clone().add(i + 1, "months") - s))) || 0;
  }

  function ts(e) {
    var t;
    return void 0 === e ? this._locale._abbr : (null != (t = fi(e)) && (this._locale = t), this);
  }

  ne.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ", ne.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
  var is = xe("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (e) {
    return void 0 === e ? this.localeData() : this.locale(e);
  });

  function ss() {
    return this._locale;
  }

  var ns = 1e3,
      rs = 60 * ns,
      as = 60 * rs,
      os = 3506328 * as;

  function ds(e, t) {
    return (e % t + t) % t;
  }

  function ls(e, t, i) {
    return e < 100 && e >= 0 ? new Date(e + 400, t, i) - os : new Date(e, t, i).valueOf();
  }

  function hs(e, t, i) {
    return e < 100 && e >= 0 ? Date.UTC(e + 400, t, i) - os : Date.UTC(e, t, i);
  }

  function us(e, t) {
    Ge(0, [e, e.length], 0, t);
  }

  function cs(e, t, i, s, n) {
    var r;
    return null == e ? $t(this, s, n).year : (t > (r = zt(e, s, n)) && (t = r), function (e, t, i, s, n) {
      var r = Gt(e, t, i, s, n),
          a = Ht(r.year, 0, r.dayOfYear);
      return this.year(a.getUTCFullYear()), this.month(a.getUTCMonth()), this.date(a.getUTCDate()), this;
    }.call(this, e, t, i, s, n));
  }

  Ge(0, ["gg", 2], 0, function () {
    return this.weekYear() % 100;
  }), Ge(0, ["GG", 2], 0, function () {
    return this.isoWeekYear() % 100;
  }), us("gggg", "weekYear"), us("ggggg", "weekYear"), us("GGGG", "isoWeekYear"), us("GGGGG", "isoWeekYear"), We("weekYear", "gg"), We("isoWeekYear", "GG"), Re("weekYear", 1), Re("isoWeekYear", 1), ht("G", rt), ht("g", rt), ht("GG", Xe, qe), ht("gg", Xe, qe), ht("GGGG", it, Je), ht("gggg", it, Je), ht("GGGGG", st, Qe), ht("ggggg", st, Qe), mt(["gggg", "ggggg", "GGGG", "GGGGG"], function (e, t, i, s) {
    t[s.substr(0, 2)] = ke(e);
  }), mt(["gg", "GG"], function (e, t, i, s) {
    t[s] = ne.parseTwoDigitYear(e);
  }), Ge("Q", 0, "Qo", "quarter"), We("quarter", "Q"), Re("quarter", 7), ht("Q", Ze), _t("Q", function (e, t) {
    t[gt] = 3 * (ke(e) - 1);
  }), Ge("D", ["DD", 2], "Do", "date"), We("date", "D"), Re("date", 9), ht("D", Xe), ht("DD", Xe, qe), ht("Do", function (e, t) {
    return e ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient;
  }), _t(["D", "DD"], vt), _t("Do", function (e, t) {
    t[vt] = ke(e.match(Xe)[0]);
  });
  var fs = Pt("Date", !0);
  Ge("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), We("dayOfYear", "DDD"), Re("dayOfYear", 4), ht("DDD", tt), ht("DDDD", Be), _t(["DDD", "DDDD"], function (e, t, i) {
    i._dayOfYear = ke(e);
  }), Ge("m", ["mm", 2], 0, "minute"), We("minute", "m"), Re("minute", 14), ht("m", Xe), ht("mm", Xe, qe), _t(["m", "mm"], St);

  var _s = Pt("Minutes", !1);

  Ge("s", ["ss", 2], 0, "second"), We("second", "s"), Re("second", 15), ht("s", Xe), ht("ss", Xe, qe), _t(["s", "ss"], bt);
  var ms,
      ps = Pt("Seconds", !1);

  for (Ge("S", 0, 0, function () {
    return ~~(this.millisecond() / 100);
  }), Ge(0, ["SS", 2], 0, function () {
    return ~~(this.millisecond() / 10);
  }), Ge(0, ["SSS", 3], 0, "millisecond"), Ge(0, ["SSSS", 4], 0, function () {
    return 10 * this.millisecond();
  }), Ge(0, ["SSSSS", 5], 0, function () {
    return 100 * this.millisecond();
  }), Ge(0, ["SSSSSS", 6], 0, function () {
    return 1e3 * this.millisecond();
  }), Ge(0, ["SSSSSSS", 7], 0, function () {
    return 1e4 * this.millisecond();
  }), Ge(0, ["SSSSSSSS", 8], 0, function () {
    return 1e5 * this.millisecond();
  }), Ge(0, ["SSSSSSSSS", 9], 0, function () {
    return 1e6 * this.millisecond();
  }), We("millisecond", "ms"), Re("millisecond", 16), ht("S", tt, Ze), ht("SS", tt, qe), ht("SSS", tt, Be), ms = "SSSS"; ms.length <= 9; ms += "S") ht(ms, nt);

  function ys(e, t) {
    t[kt] = ke(1e3 * ("0." + e));
  }

  for (ms = "S"; ms.length <= 9; ms += "S") _t(ms, ys);

  var gs = Pt("Milliseconds", !1);
  Ge("z", 0, 0, "zoneAbbr"), Ge("zz", 0, 0, "zoneName");
  var vs = we.prototype;

  function ws(e) {
    return e;
  }

  vs.add = Xi, vs.calendar = function (e, t) {
    var i = e || Ci(),
        s = Hi(i, this).startOf("day"),
        n = ne.calendarFormat(this, s) || "sameElse",
        r = t && (Pe(t[n]) ? t[n].call(this, i) : t[n]);
    return this.format(r || this.localeData().calendar(n, this, Ci(i)));
  }, vs.clone = function () {
    return new we(this);
  }, vs.diff = function (e, t, i) {
    var s, n, r;
    if (!this.isValid()) return NaN;
    if (!(s = Hi(e, this)).isValid()) return NaN;

    switch (n = 6e4 * (s.utcOffset() - this.utcOffset()), t = Ve(t)) {
      case "year":
        r = es(this, s) / 12;
        break;

      case "month":
        r = es(this, s);
        break;

      case "quarter":
        r = es(this, s) / 3;
        break;

      case "second":
        r = (this - s) / 1e3;
        break;

      case "minute":
        r = (this - s) / 6e4;
        break;

      case "hour":
        r = (this - s) / 36e5;
        break;

      case "day":
        r = (this - s - n) / 864e5;
        break;

      case "week":
        r = (this - s - n) / 6048e5;
        break;

      default:
        r = this - s;
    }

    return i ? r : be(r);
  }, vs.endOf = function (e) {
    var t;
    if (void 0 === (e = Ve(e)) || "millisecond" === e || !this.isValid()) return this;
    var i = this._isUTC ? hs : ls;

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
        t = this._d.valueOf(), t += as - ds(t + (this._isUTC ? 0 : this.utcOffset() * rs), as) - 1;
        break;

      case "minute":
        t = this._d.valueOf(), t += rs - ds(t, rs) - 1;
        break;

      case "second":
        t = this._d.valueOf(), t += ns - ds(t, ns) - 1;
    }

    return this._d.setTime(t), ne.updateOffset(this, !0), this;
  }, vs.format = function (e) {
    e || (e = this.isUtc() ? ne.defaultFormatUtc : ne.defaultFormat);
    var t = $e(this, e);
    return this.localeData().postformat(t);
  }, vs.from = function (e, t) {
    return this.isValid() && (Se(e) && e.isValid() || Ci(e).isValid()) ? Zi({
      to: this,
      from: e
    }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate();
  }, vs.fromNow = function (e) {
    return this.from(Ci(), e);
  }, vs.to = function (e, t) {
    return this.isValid() && (Se(e) && e.isValid() || Ci(e).isValid()) ? Zi({
      from: this,
      to: e
    }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate();
  }, vs.toNow = function (e) {
    return this.to(Ci(), e);
  }, vs.get = function (e) {
    return Pe(this[e = Ve(e)]) ? this[e]() : this;
  }, vs.invalidAt = function () {
    return _e(this).overflow;
  }, vs.isAfter = function (e, t) {
    var i = Se(e) ? e : Ci(e);
    return !(!this.isValid() || !i.isValid()) && ("millisecond" === (t = Ve(t) || "millisecond") ? this.valueOf() > i.valueOf() : i.valueOf() < this.clone().startOf(t).valueOf());
  }, vs.isBefore = function (e, t) {
    var i = Se(e) ? e : Ci(e);
    return !(!this.isValid() || !i.isValid()) && ("millisecond" === (t = Ve(t) || "millisecond") ? this.valueOf() < i.valueOf() : this.clone().endOf(t).valueOf() < i.valueOf());
  }, vs.isBetween = function (e, t, i, s) {
    var n = Se(e) ? e : Ci(e),
        r = Se(t) ? t : Ci(t);
    return !!(this.isValid() && n.isValid() && r.isValid()) && ("(" === (s = s || "()")[0] ? this.isAfter(n, i) : !this.isBefore(n, i)) && (")" === s[1] ? this.isBefore(r, i) : !this.isAfter(r, i));
  }, vs.isSame = function (e, t) {
    var i,
        s = Se(e) ? e : Ci(e);
    return !(!this.isValid() || !s.isValid()) && ("millisecond" === (t = Ve(t) || "millisecond") ? this.valueOf() === s.valueOf() : (i = s.valueOf(), this.clone().startOf(t).valueOf() <= i && i <= this.clone().endOf(t).valueOf()));
  }, vs.isSameOrAfter = function (e, t) {
    return this.isSame(e, t) || this.isAfter(e, t);
  }, vs.isSameOrBefore = function (e, t) {
    return this.isSame(e, t) || this.isBefore(e, t);
  }, vs.isValid = function () {
    return me(this);
  }, vs.lang = is, vs.locale = ts, vs.localeData = ss, vs.max = Fi, vs.min = Ni, vs.parsingFlags = function () {
    return ce({}, _e(this));
  }, vs.set = function (e, t) {
    if ("object" == typeof e) for (var i = function (e) {
      var t = [];

      for (var i in e) t.push({
        unit: i,
        priority: Ee[i]
      });

      return t.sort(function (e, t) {
        return e.priority - t.priority;
      }), t;
    }(e = je(e)), s = 0; s < i.length; s++) this[i[s].unit](e[i[s].unit]);else if (Pe(this[e = Ve(e)])) return this[e](t);
    return this;
  }, vs.startOf = function (e) {
    var t;
    if (void 0 === (e = Ve(e)) || "millisecond" === e || !this.isValid()) return this;
    var i = this._isUTC ? hs : ls;

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
        t = this._d.valueOf(), t -= ds(t + (this._isUTC ? 0 : this.utcOffset() * rs), as);
        break;

      case "minute":
        t = this._d.valueOf(), t -= ds(t, rs);
        break;

      case "second":
        t = this._d.valueOf(), t -= ds(t, ns);
    }

    return this._d.setTime(t), ne.updateOffset(this, !0), this;
  }, vs.subtract = Ki, vs.toArray = function () {
    var e = this;
    return [e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second(), e.millisecond()];
  }, vs.toObject = function () {
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
  }, vs.toDate = function () {
    return new Date(this.valueOf());
  }, vs.toISOString = function (e) {
    if (!this.isValid()) return null;
    var t = !0 !== e,
        i = t ? this.clone().utc() : this;
    return i.year() < 0 || i.year() > 9999 ? $e(i, t ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ") : Pe(Date.prototype.toISOString) ? t ? this.toDate().toISOString() : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3).toISOString().replace("Z", $e(i, "Z")) : $e(i, t ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
  }, vs.inspect = function () {
    if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
    var e = "moment",
        t = "";
    this.isLocal() || (e = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone", t = "Z");
    var i = "[" + e + '("]',
        s = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY",
        n = t + '[")]';
    return this.format(i + s + "-MM-DD[T]HH:mm:ss.SSS" + n);
  }, vs.toJSON = function () {
    return this.isValid() ? this.toISOString() : null;
  }, vs.toString = function () {
    return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
  }, vs.unix = function () {
    return Math.floor(this.valueOf() / 1e3);
  }, vs.valueOf = function () {
    return this._d.valueOf() - 6e4 * (this._offset || 0);
  }, vs.creationData = function () {
    return {
      input: this._i,
      format: this._f,
      locale: this._locale,
      isUTC: this._isUTC,
      strict: this._strict
    };
  }, vs.year = Tt, vs.isLeapYear = function () {
    return Ot(this.year());
  }, vs.weekYear = function (e) {
    return cs.call(this, e, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
  }, vs.isoWeekYear = function (e) {
    return cs.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4);
  }, vs.quarter = vs.quarters = function (e) {
    return null == e ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (e - 1) + this.month() % 3);
  }, vs.month = Rt, vs.daysInMonth = function () {
    return Ft(this.year(), this.month());
  }, vs.week = vs.weeks = function (e) {
    var t = this.localeData().week(this);
    return null == e ? t : this.add(7 * (e - t), "d");
  }, vs.isoWeek = vs.isoWeeks = function (e) {
    var t = $t(this, 1, 4).week;
    return null == e ? t : this.add(7 * (e - t), "d");
  }, vs.weeksInYear = function () {
    var e = this.localeData()._week;

    return zt(this.year(), e.dow, e.doy);
  }, vs.isoWeeksInYear = function () {
    return zt(this.year(), 1, 4);
  }, vs.date = fs, vs.day = vs.days = function (e) {
    if (!this.isValid()) return null != e ? this : NaN;
    var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    return null != e ? (e = function (e, t) {
      return "string" != typeof e ? e : isNaN(e) ? "number" == typeof (e = t.weekdaysParse(e)) ? e : null : parseInt(e, 10);
    }(e, this.localeData()), this.add(e - t, "d")) : t;
  }, vs.weekday = function (e) {
    if (!this.isValid()) return null != e ? this : NaN;
    var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return null == e ? t : this.add(e - t, "d");
  }, vs.isoWeekday = function (e) {
    if (!this.isValid()) return null != e ? this : NaN;

    if (null != e) {
      var t = function (e, t) {
        return "string" == typeof e ? t.weekdaysParse(e) % 7 || 7 : isNaN(e) ? null : e;
      }(e, this.localeData());

      return this.day(this.day() % 7 ? t : t - 7);
    }

    return this.day() || 7;
  }, vs.dayOfYear = function (e) {
    var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
    return null == e ? t : this.add(e - t, "d");
  }, vs.hour = vs.hours = ri, vs.minute = vs.minutes = _s, vs.second = vs.seconds = ps, vs.millisecond = vs.milliseconds = gs, vs.utcOffset = function (e, t, i) {
    var s,
        n = this._offset || 0;
    if (!this.isValid()) return null != e ? this : NaN;

    if (null != e) {
      if ("string" == typeof e) {
        if (null === (e = Li(ot, e))) return this;
      } else Math.abs(e) < 16 && !i && (e *= 60);

      return !this._isUTC && t && (s = Ii(this)), this._offset = e, this._isUTC = !0, null != s && this.add(s, "m"), n !== e && (!t || this._changeInProgress ? Qi(this, Zi(e - n, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, ne.updateOffset(this, !0), this._changeInProgress = null)), this;
    }

    return this._isUTC ? n : Ii(this);
  }, vs.utc = function (e) {
    return this.utcOffset(0, e);
  }, vs.local = function (e) {
    return this._isUTC && (this.utcOffset(0, e), this._isUTC = !1, e && this.subtract(Ii(this), "m")), this;
  }, vs.parseZone = function () {
    if (null != this._tzm) this.utcOffset(this._tzm, !1, !0);else if ("string" == typeof this._i) {
      var e = Li(at, this._i);
      null != e ? this.utcOffset(e) : this.utcOffset(0, !0);
    }
    return this;
  }, vs.hasAlignedHourOffset = function (e) {
    return !!this.isValid() && (e = e ? Ci(e).utcOffset() : 0, (this.utcOffset() - e) % 60 == 0);
  }, vs.isDST = function () {
    return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
  }, vs.isLocal = function () {
    return !!this.isValid() && !this._isUTC;
  }, vs.isUtcOffset = function () {
    return !!this.isValid() && this._isUTC;
  }, vs.isUtc = Gi, vs.isUTC = Gi, vs.zoneAbbr = function () {
    return this._isUTC ? "UTC" : "";
  }, vs.zoneName = function () {
    return this._isUTC ? "Coordinated Universal Time" : "";
  }, vs.dates = xe("dates accessor is deprecated. Use date instead.", fs), vs.months = xe("months accessor is deprecated. Use month instead", Rt), vs.years = xe("years accessor is deprecated. Use year instead", Tt), vs.zone = xe("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", function (e, t) {
    return null != e ? ("string" != typeof e && (e = -e), this.utcOffset(e, t), this) : -this.utcOffset();
  }), vs.isDSTShifted = xe("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", function () {
    if (!oe(this._isDSTShifted)) return this._isDSTShifted;
    var e = {};

    if (ge(e, this), (e = Ti(e))._a) {
      var t = e._isUTC ? fe(e._a) : Ci(e._a);
      this._isDSTShifted = this.isValid() && Me(e._a, t.toArray()) > 0;
    } else this._isDSTShifted = !1;

    return this._isDSTShifted;
  });
  var Ss = Ne.prototype;

  function bs(e, t, i, s) {
    var n = fi(),
        r = fe().set(s, t);
    return n[i](r, e);
  }

  function ks(e, t, i) {
    if (de(e) && (t = e, e = void 0), e = e || "", null != t) return bs(e, t, i, "month");
    var s,
        n = [];

    for (s = 0; s < 12; s++) n[s] = bs(e, s, i, "month");

    return n;
  }

  function Ms(e, t, i, s) {
    "boolean" == typeof e ? (de(t) && (i = t, t = void 0), t = t || "") : (i = t = e, e = !1, de(t) && (i = t, t = void 0), t = t || "");
    var n,
        r = fi(),
        a = e ? r._week.dow : 0;
    if (null != i) return bs(t, (i + a) % 7, s, "day");
    var o = [];

    for (n = 0; n < 7; n++) o[n] = bs(t, (n + a) % 7, s, "day");

    return o;
  }

  Ss.calendar = function (e, t, i) {
    var s = this._calendar[e] || this._calendar.sameElse;
    return Pe(s) ? s.call(t, i) : s;
  }, Ss.longDateFormat = function (e) {
    var t = this._longDateFormat[e],
        i = this._longDateFormat[e.toUpperCase()];

    return t || !i ? t : (this._longDateFormat[e] = i.replace(/MMMM|MM|DD|dddd/g, function (e) {
      return e.slice(1);
    }), this._longDateFormat[e]);
  }, Ss.invalidDate = function () {
    return this._invalidDate;
  }, Ss.ordinal = function (e) {
    return this._ordinal.replace("%d", e);
  }, Ss.preparse = ws, Ss.postformat = ws, Ss.relativeTime = function (e, t, i, s) {
    var n = this._relativeTime[i];
    return Pe(n) ? n(e, t, i, s) : n.replace(/%d/i, e);
  }, Ss.pastFuture = function (e, t) {
    var i = this._relativeTime[e > 0 ? "future" : "past"];
    return Pe(i) ? i(t) : i.replace(/%s/i, t);
  }, Ss.set = function (e) {
    var t, i;

    for (i in e) Pe(t = e[i]) ? this[i] = t : this["_" + i] = t;

    this._config = e, this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
  }, Ss.months = function (e, t) {
    return e ? re(this._months) ? this._months[e.month()] : this._months[(this._months.isFormat || Wt).test(t) ? "format" : "standalone"][e.month()] : re(this._months) ? this._months : this._months.standalone;
  }, Ss.monthsShort = function (e, t) {
    return e ? re(this._monthsShort) ? this._monthsShort[e.month()] : this._monthsShort[Wt.test(t) ? "format" : "standalone"][e.month()] : re(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
  }, Ss.monthsParse = function (e, t, i) {
    var s, n, r;
    if (this._monthsParseExact) return function (e, t, i) {
      var s,
          n,
          r,
          a = e.toLocaleLowerCase();
      if (!this._monthsParse) for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], s = 0; s < 12; ++s) r = fe([2e3, s]), this._shortMonthsParse[s] = this.monthsShort(r, "").toLocaleLowerCase(), this._longMonthsParse[s] = this.months(r, "").toLocaleLowerCase();
      return i ? "MMM" === t ? -1 !== (n = Yt.call(this._shortMonthsParse, a)) ? n : null : -1 !== (n = Yt.call(this._longMonthsParse, a)) ? n : null : "MMM" === t ? -1 !== (n = Yt.call(this._shortMonthsParse, a)) ? n : -1 !== (n = Yt.call(this._longMonthsParse, a)) ? n : null : -1 !== (n = Yt.call(this._longMonthsParse, a)) ? n : -1 !== (n = Yt.call(this._shortMonthsParse, a)) ? n : null;
    }.call(this, e, t, i);

    for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), s = 0; s < 12; s++) {
      if (n = fe([2e3, s]), i && !this._longMonthsParse[s] && (this._longMonthsParse[s] = new RegExp("^" + this.months(n, "").replace(".", "") + "$", "i"), this._shortMonthsParse[s] = new RegExp("^" + this.monthsShort(n, "").replace(".", "") + "$", "i")), i || this._monthsParse[s] || (r = "^" + this.months(n, "") + "|^" + this.monthsShort(n, ""), this._monthsParse[s] = new RegExp(r.replace(".", ""), "i")), i && "MMMM" === t && this._longMonthsParse[s].test(e)) return s;
      if (i && "MMM" === t && this._shortMonthsParse[s].test(e)) return s;
      if (!i && this._monthsParse[s].test(e)) return s;
    }
  }, Ss.monthsRegex = function (e) {
    return this._monthsParseExact ? (ue(this, "_monthsRegex") || Lt.call(this), e ? this._monthsStrictRegex : this._monthsRegex) : (ue(this, "_monthsRegex") || (this._monthsRegex = At), this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex);
  }, Ss.monthsShortRegex = function (e) {
    return this._monthsParseExact ? (ue(this, "_monthsRegex") || Lt.call(this), e ? this._monthsShortStrictRegex : this._monthsShortRegex) : (ue(this, "_monthsShortRegex") || (this._monthsShortRegex = Ut), this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex);
  }, Ss.week = function (e) {
    return $t(e, this._week.dow, this._week.doy).week;
  }, Ss.firstDayOfYear = function () {
    return this._week.doy;
  }, Ss.firstDayOfWeek = function () {
    return this._week.dow;
  }, Ss.weekdays = function (e, t) {
    var i = re(this._weekdays) ? this._weekdays : this._weekdays[e && !0 !== e && this._weekdays.isFormat.test(t) ? "format" : "standalone"];
    return !0 === e ? Zt(i, this._week.dow) : e ? i[e.day()] : i;
  }, Ss.weekdaysMin = function (e) {
    return !0 === e ? Zt(this._weekdaysMin, this._week.dow) : e ? this._weekdaysMin[e.day()] : this._weekdaysMin;
  }, Ss.weekdaysShort = function (e) {
    return !0 === e ? Zt(this._weekdaysShort, this._week.dow) : e ? this._weekdaysShort[e.day()] : this._weekdaysShort;
  }, Ss.weekdaysParse = function (e, t, i) {
    var s, n, r;
    if (this._weekdaysParseExact) return function (e, t, i) {
      var s,
          n,
          r,
          a = e.toLocaleLowerCase();
      if (!this._weekdaysParse) for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], s = 0; s < 7; ++s) r = fe([2e3, 1]).day(s), this._minWeekdaysParse[s] = this.weekdaysMin(r, "").toLocaleLowerCase(), this._shortWeekdaysParse[s] = this.weekdaysShort(r, "").toLocaleLowerCase(), this._weekdaysParse[s] = this.weekdays(r, "").toLocaleLowerCase();
      return i ? "dddd" === t ? -1 !== (n = Yt.call(this._weekdaysParse, a)) ? n : null : "ddd" === t ? -1 !== (n = Yt.call(this._shortWeekdaysParse, a)) ? n : null : -1 !== (n = Yt.call(this._minWeekdaysParse, a)) ? n : null : "dddd" === t ? -1 !== (n = Yt.call(this._weekdaysParse, a)) ? n : -1 !== (n = Yt.call(this._shortWeekdaysParse, a)) ? n : -1 !== (n = Yt.call(this._minWeekdaysParse, a)) ? n : null : "ddd" === t ? -1 !== (n = Yt.call(this._shortWeekdaysParse, a)) ? n : -1 !== (n = Yt.call(this._weekdaysParse, a)) ? n : -1 !== (n = Yt.call(this._minWeekdaysParse, a)) ? n : null : -1 !== (n = Yt.call(this._minWeekdaysParse, a)) ? n : -1 !== (n = Yt.call(this._weekdaysParse, a)) ? n : -1 !== (n = Yt.call(this._shortWeekdaysParse, a)) ? n : null;
    }.call(this, e, t, i);

    for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), s = 0; s < 7; s++) {
      if (n = fe([2e3, 1]).day(s), i && !this._fullWeekdaysParse[s] && (this._fullWeekdaysParse[s] = new RegExp("^" + this.weekdays(n, "").replace(".", "\\.?") + "$", "i"), this._shortWeekdaysParse[s] = new RegExp("^" + this.weekdaysShort(n, "").replace(".", "\\.?") + "$", "i"), this._minWeekdaysParse[s] = new RegExp("^" + this.weekdaysMin(n, "").replace(".", "\\.?") + "$", "i")), this._weekdaysParse[s] || (r = "^" + this.weekdays(n, "") + "|^" + this.weekdaysShort(n, "") + "|^" + this.weekdaysMin(n, ""), this._weekdaysParse[s] = new RegExp(r.replace(".", ""), "i")), i && "dddd" === t && this._fullWeekdaysParse[s].test(e)) return s;
      if (i && "ddd" === t && this._shortWeekdaysParse[s].test(e)) return s;
      if (i && "dd" === t && this._minWeekdaysParse[s].test(e)) return s;
      if (!i && this._weekdaysParse[s].test(e)) return s;
    }
  }, Ss.weekdaysRegex = function (e) {
    return this._weekdaysParseExact ? (ue(this, "_weekdaysRegex") || ei.call(this), e ? this._weekdaysStrictRegex : this._weekdaysRegex) : (ue(this, "_weekdaysRegex") || (this._weekdaysRegex = Qt), this._weekdaysStrictRegex && e ? this._weekdaysStrictRegex : this._weekdaysRegex);
  }, Ss.weekdaysShortRegex = function (e) {
    return this._weekdaysParseExact ? (ue(this, "_weekdaysRegex") || ei.call(this), e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (ue(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = Xt), this._weekdaysShortStrictRegex && e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
  }, Ss.weekdaysMinRegex = function (e) {
    return this._weekdaysParseExact ? (ue(this, "_weekdaysRegex") || ei.call(this), e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (ue(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Kt), this._weekdaysMinStrictRegex && e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
  }, Ss.isPM = function (e) {
    return "p" === (e + "").toLowerCase().charAt(0);
  }, Ss.meridiem = function (e, t, i) {
    return e > 11 ? i ? "pm" : "PM" : i ? "am" : "AM";
  }, ui("en", {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function (e) {
      var t = e % 10;
      return e + (1 === ke(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th");
    }
  }), ne.lang = xe("moment.lang is deprecated. Use moment.locale instead.", ui), ne.langData = xe("moment.langData is deprecated. Use moment.localeData instead.", fi);
  var Ds = Math.abs;

  function xs(e, t, i, s) {
    var n = Zi(t, i);
    return e._milliseconds += s * n._milliseconds, e._days += s * n._days, e._months += s * n._months, e._bubble();
  }

  function Os(e) {
    return e < 0 ? Math.floor(e) : Math.ceil(e);
  }

  function Ys(e) {
    return 4800 * e / 146097;
  }

  function Ts(e) {
    return 146097 * e / 4800;
  }

  function Ps(e) {
    return function () {
      return this.as(e);
    };
  }

  var Cs = Ps("ms"),
      Ns = Ps("s"),
      Fs = Ps("m"),
      Ws = Ps("h"),
      Vs = Ps("d"),
      js = Ps("w"),
      Es = Ps("M"),
      Rs = Ps("Q"),
      Us = Ps("y");

  function As(e) {
    return function () {
      return this.isValid() ? this._data[e] : NaN;
    };
  }

  var Ls = As("milliseconds"),
      Hs = As("seconds"),
      Is = As("minutes"),
      Gs = As("hours"),
      $s = As("days"),
      zs = As("months"),
      Zs = As("years");
  var qs = Math.round,
      Bs = {
    ss: 44,
    s: 45,
    m: 45,
    h: 22,
    d: 26,
    M: 11
  };
  var Js = Math.abs;

  function Qs(e) {
    return (e > 0) - (e < 0) || +e;
  }

  function Xs() {
    if (!this.isValid()) return this.localeData().invalidDate();
    var e,
        t,
        i = Js(this._milliseconds) / 1e3,
        s = Js(this._days),
        n = Js(this._months);
    e = be(i / 60), t = be(e / 60), i %= 60, e %= 60;
    var r = be(n / 12),
        a = n %= 12,
        o = s,
        d = t,
        l = e,
        h = i ? i.toFixed(3).replace(/\.?0+$/, "") : "",
        u = this.asSeconds();
    if (!u) return "P0D";

    var c = u < 0 ? "-" : "",
        f = Qs(this._months) !== Qs(u) ? "-" : "",
        _ = Qs(this._days) !== Qs(u) ? "-" : "",
        m = Qs(this._milliseconds) !== Qs(u) ? "-" : "";

    return c + "P" + (r ? f + r + "Y" : "") + (a ? f + a + "M" : "") + (o ? _ + o + "D" : "") + (d || l || h ? "T" : "") + (d ? m + d + "H" : "") + (l ? m + l + "M" : "") + (h ? m + h + "S" : "");
  }

  var Ks = ji.prototype;
  Ks.isValid = function () {
    return this._isValid;
  }, Ks.abs = function () {
    var e = this._data;
    return this._milliseconds = Ds(this._milliseconds), this._days = Ds(this._days), this._months = Ds(this._months), e.milliseconds = Ds(e.milliseconds), e.seconds = Ds(e.seconds), e.minutes = Ds(e.minutes), e.hours = Ds(e.hours), e.months = Ds(e.months), e.years = Ds(e.years), this;
  }, Ks.add = function (e, t) {
    return xs(this, e, t, 1);
  }, Ks.subtract = function (e, t) {
    return xs(this, e, t, -1);
  }, Ks.as = function (e) {
    if (!this.isValid()) return NaN;
    var t,
        i,
        s = this._milliseconds;
    if ("month" === (e = Ve(e)) || "quarter" === e || "year" === e) switch (t = this._days + s / 864e5, i = this._months + Ys(t), e) {
      case "month":
        return i;

      case "quarter":
        return i / 3;

      case "year":
        return i / 12;
    } else switch (t = this._days + Math.round(Ts(this._months)), e) {
      case "week":
        return t / 7 + s / 6048e5;

      case "day":
        return t + s / 864e5;

      case "hour":
        return 24 * t + s / 36e5;

      case "minute":
        return 1440 * t + s / 6e4;

      case "second":
        return 86400 * t + s / 1e3;

      case "millisecond":
        return Math.floor(864e5 * t) + s;

      default:
        throw new Error("Unknown unit " + e);
    }
  }, Ks.asMilliseconds = Cs, Ks.asSeconds = Ns, Ks.asMinutes = Fs, Ks.asHours = Ws, Ks.asDays = Vs, Ks.asWeeks = js, Ks.asMonths = Es, Ks.asQuarters = Rs, Ks.asYears = Us, Ks.valueOf = function () {
    return this.isValid() ? this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * ke(this._months / 12) : NaN;
  }, Ks._bubble = function () {
    var e,
        t,
        i,
        s,
        n,
        r = this._milliseconds,
        a = this._days,
        o = this._months,
        d = this._data;
    return r >= 0 && a >= 0 && o >= 0 || r <= 0 && a <= 0 && o <= 0 || (r += 864e5 * Os(Ts(o) + a), a = 0, o = 0), d.milliseconds = r % 1e3, e = be(r / 1e3), d.seconds = e % 60, t = be(e / 60), d.minutes = t % 60, i = be(t / 60), d.hours = i % 24, a += be(i / 24), o += n = be(Ys(a)), a -= Os(Ts(n)), s = be(o / 12), o %= 12, d.days = a, d.months = o, d.years = s, this;
  }, Ks.clone = function () {
    return Zi(this);
  }, Ks.get = function (e) {
    return e = Ve(e), this.isValid() ? this[e + "s"]() : NaN;
  }, Ks.milliseconds = Ls, Ks.seconds = Hs, Ks.minutes = Is, Ks.hours = Gs, Ks.days = $s, Ks.weeks = function () {
    return be(this.days() / 7);
  }, Ks.months = zs, Ks.years = Zs, Ks.humanize = function (e) {
    if (!this.isValid()) return this.localeData().invalidDate();

    var t = this.localeData(),
        i = function (e, t, i) {
      var s = Zi(e).abs(),
          n = qs(s.as("s")),
          r = qs(s.as("m")),
          a = qs(s.as("h")),
          o = qs(s.as("d")),
          d = qs(s.as("M")),
          l = qs(s.as("y")),
          h = n <= Bs.ss && ["s", n] || n < Bs.s && ["ss", n] || r <= 1 && ["m"] || r < Bs.m && ["mm", r] || a <= 1 && ["h"] || a < Bs.h && ["hh", a] || o <= 1 && ["d"] || o < Bs.d && ["dd", o] || d <= 1 && ["M"] || d < Bs.M && ["MM", d] || l <= 1 && ["y"] || ["yy", l];
      return h[2] = t, h[3] = +e > 0, h[4] = i, function (e, t, i, s, n) {
        return n.relativeTime(t || 1, !!i, e, s);
      }.apply(null, h);
    }(this, !e, t);

    return e && (i = t.pastFuture(+this, i)), t.postformat(i);
  }, Ks.toISOString = Xs, Ks.toString = Xs, Ks.toJSON = Xs, Ks.locale = ts, Ks.localeData = ss, Ks.toIsoString = xe("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", Xs), Ks.lang = is, Ge("X", 0, 0, "unix"), Ge("x", 0, 0, "valueOf"), ht("x", rt), ht("X", /[+-]?\d+(\.\d{1,3})?/), _t("X", function (e, t, i) {
    i._d = new Date(1e3 * parseFloat(e, 10));
  }), _t("x", function (e, t, i) {
    i._d = new Date(ke(e));
  }), ne.version = "2.24.0", ie = Ci, ne.fn = vs, ne.min = function () {
    return Wi("isBefore", [].slice.call(arguments, 0));
  }, ne.max = function () {
    return Wi("isAfter", [].slice.call(arguments, 0));
  }, ne.now = function () {
    return Date.now ? Date.now() : +new Date();
  }, ne.utc = fe, ne.unix = function (e) {
    return Ci(1e3 * e);
  }, ne.months = function (e, t) {
    return ks(e, t, "months");
  }, ne.isDate = le, ne.locale = ui, ne.invalid = pe, ne.duration = Zi, ne.isMoment = Se, ne.weekdays = function (e, t, i) {
    return Ms(e, t, i, "weekdays");
  }, ne.parseZone = function () {
    return Ci.apply(null, arguments).parseZone();
  }, ne.localeData = fi, ne.isDuration = Ei, ne.monthsShort = function (e, t) {
    return ks(e, t, "monthsShort");
  }, ne.weekdaysMin = function (e, t, i) {
    return Ms(e, t, i, "weekdaysMin");
  }, ne.defineLocale = ci, ne.updateLocale = function (e, t) {
    if (null != t) {
      var i,
          s,
          n = ai;
      null != (s = hi(e)) && (n = s._config), (i = new Ne(t = Ce(n, t))).parentLocale = oi[e], oi[e] = i, ui(e);
    } else null != oi[e] && (null != oi[e].parentLocale ? oi[e] = oi[e].parentLocale : null != oi[e] && delete oi[e]);

    return oi[e];
  }, ne.locales = function () {
    return Oe(oi);
  }, ne.weekdaysShort = function (e, t, i) {
    return Ms(e, t, i, "weekdaysShort");
  }, ne.normalizeUnits = Ve, ne.relativeTimeRounding = function (e) {
    return void 0 === e ? qs : "function" == typeof e && (qs = e, !0);
  }, ne.relativeTimeThreshold = function (e, t) {
    return void 0 !== Bs[e] && (void 0 === t ? Bs[e] : (Bs[e] = t, "s" === e && (Bs.ss = t - 1), !0));
  }, ne.calendarFormat = function (e, t) {
    var i = e.diff(t, "days", !0);
    return i < -6 ? "sameElse" : i < -1 ? "lastWeek" : i < 0 ? "lastDay" : i < 1 ? "sameDay" : i < 2 ? "nextDay" : i < 7 ? "nextWeek" : "sameElse";
  }, ne.prototype = vs, ne.HTML5_FMT = {
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
  const en = {
    delivered: !1,
    first_letter: !1,
    header: !1
  };

  class tn extends te {
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
      super(), this._hass = null, this.deliveryObject = null, this.distributionObject = null, this.letterObject = null, this.delivery_enroute = [], this.delivery_delivered = [], this.distribution_enroute = [], this.distribution_delivered = [], this.letters = [], this.icon = null, this.name = null, this.date_format = null, this.time_format = null, this.past_days = null, this._language = null, this._hide = en;
    }

    set hass(e) {
      this._hass = e, this.config.delivery && (this.deliveryObject = e.states[this.config.delivery]), this.config.distribution && (this.distributionObject = e.states[this.config.distribution]), this.config.letters && (this.letterObject = e.states[this.config.letters]), this.config.hide && (this._hide = { ...this._hide,
        ...this.config.hide
      }), "string" == typeof this.config.name ? this.name = this.config.name : this.name = "PostNL", this.config.icon ? this.icon = this.config.icon : this.icon = "mdi:mailbox", this.config.date_format ? this.date_format = this.config.date_format : this.date_format = "DD MMM YYYY", this.config.time_format ? this.time_format = this.config.time_format : this.time_format = "HH:mm", this.config.past_days ? this.past_days = parseInt(this.config.past_days, 10) : this.past_days = 1, this._language = e.language, this.delivery_enroute = [], this.delivery_delivered = [], this.distribution_enroute = [], this.distribution_delivered = [], this.letters = [], this.letterObject && Object.entries(this.letterObject.attributes.letters).sort((e, t) => new Date(t[1].delivery_date) - new Date(e[1].delivery_date)).map(([e, t]) => {
        ne(t.delivery_date).isBefore(ne().subtract(this.past_days, "days").startOf("day")) || this.letters.push(t);
      }), this.deliveryObject && (Object.entries(this.deliveryObject.attributes.enroute).sort((e, t) => new Date(t[1].planned_date) - new Date(e[1].planned_date)).map(([e, t]) => {
        this.delivery_enroute.push(t);
      }), Object.entries(this.deliveryObject.attributes.delivered).sort((e, t) => new Date(t[1].delivery_date) - new Date(e[1].delivery_date)).map(([e, t]) => {
        null != t.delivery_date && ne(t.delivery_date).isBefore(ne().subtract(this.past_days, "days").startOf("day")) || this.delivery_delivered.push(t);
      })), this.distributionObject && (Object.entries(this.distributionObject.attributes.enroute).sort((e, t) => new Date(t[1].planned_date) - new Date(e[1].planned_date)).map(([e, t]) => {
        this.distribution_enroute.push(t);
      }), Object.entries(this.distributionObject.attributes.delivered).sort((e, t) => new Date(t[1].delivery_date) - new Date(e[1].delivery_date)).map(([e, t]) => {
        null != t.delivery_date && ne(t.delivery_date).isBefore(ne().subtract(this.past_days, "days").startOf("day")) || this.distribution_delivered.push(t);
      }));
    }

    render({
      _hass: e,
      _hide: t,
      _values: i,
      config: s,
      delivery: n,
      distribution: r,
      letters: a
    } = this) {
      return n || r || a ? N`
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
          Entity not available: <strong class="name">${s.delivery}</strong> or <strong class="name">${s.distribution}</strong> or <strong>${s.letters}</strong>
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
        It seems you have set the letter object, but you haven't activated this within PostNL yet. Consider removing the letter object from the card or activate this option in PostNL.
      </footer>
    ` : "";
    }

    renderLettersInfo() {
      return this.letterObject ? N`
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:email"></ha-icon><br />
        <span>${this.letters.length} letters</span>
      </div>
    ` : "";
    }

    renderLetters() {
      return !this.letterObject || this.letters && 0 === this.letters.length ? "" : N`
      <header>
        <ha-icon class="header__icon" icon="mdi:email"></ha-icon>
        <h2 class="header__title">Letters</h2>
      </header>
      ${this.renderLetterImage()}
      <section class="detail-body">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Delivery date</th>
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
          <td>${null != e.status_message ? e.status_message : "Unknown"}</td>
          <td>${this.dateConversion(e.delivery_date)}</td>
        </tr>
      ` : N`
        <tr>
          <td class="name"><a href="${e.image}" target="_blank">${e.id}</a></td>
          <td>${null != e.status_message ? e.status_message : "Unknown"}</td>
          <td>${this.dateConversion(e.delivery_date)}</td>
        </tr>
      `;
    }

    renderDeliveryInfo() {
      return this.deliveryObject ? N`
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:truck-delivery"></ha-icon><br />
        <span>${this.delivery_enroute.length} enroute</span>
      </div>
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:package-variant"></ha-icon><br />
        <span>${this.delivery_delivered.length} delivered</span>
      </div>
    ` : "";
    }

    renderDistributionInfo() {
      return this.distributionObject ? N`
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:truck-delivery"></ha-icon><br />
        <span>${this.distribution_enroute.length} enroute</span>
      </div>
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:package-variant"></ha-icon><br />
        <span>${this.distribution_delivered.length} delivered</span>
      </div>
    ` : "";
    }

    renderDelivery() {
      return this.deliveryObject ? 0 === this.delivery_enroute.length && this._hide.delivered ? "" : 0 === this.delivery_enroute.length && 0 === this.delivery_delivered.length ? "" : N`
      <header>
        <ha-icon class="header__icon" icon="mdi:package-variant"></ha-icon>
        <h2 class="header__title">Delivery</h2>
      </header>
      <section class="detail-body">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Delivery date</th>
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
        <h2 class="header__title">Distribution</h2>
      </header>
      <section class="detail-body">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Delivery date</th>
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
      let t = "Unknown",
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
      return ne(e).calendar(null, {
        sameDay: "[Today]",
        nextDay: "[Tomorrow]",
        sameElse: this.date_format
      });
    }

    timeConversion(e) {
      return ne(e).format(this.time_format);
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

  return window.customElements.define("postnl-card", tn), tn;
});
