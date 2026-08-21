/**
 * Input rendering and reading.
 *
 * Every instrument declares its questions as data, so exactly one module knows
 * how to draw a Likert row or a month picker. A new input kind is added here
 * and becomes available to every test at once — which is the second half of
 * the plugin bargain: the test supplies meaning, the shell supplies mechanics.
 */
import { html, join, raw } from "../../core/html.js";

/* ══ questionnaire items ══════════════════════════════════════════ */

/**
 * Likert rows are radio groups, not buttons, so that a keyboard and a screen
 * reader both get the behaviour they expect for free — arrow keys move within
 * the group, tab leaves it, and the group announces itself as one question.
 */
function likertHTML(item, value, scale, index) {
  const n = scale.max - scale.min + 1;
  const points = Array.from({ length: n }, (_, i) => scale.min + i);
  return html`<fieldset class="item" data-item="${item.id}" style="--i:${index}">
    <legend class="item-prompt"><span class="item-n num">${index + 1}</span>${item.prompt}</legend>
    <div class="likert" role="radiogroup" aria-label="${item.prompt}">
      <span class="likert-end">${scale.labels[0]}</span>
      ${join(points.map((p, i) => html`
        <label class="dot dot-${i}${value === p ? " on" : ""}" title="${scale.labels[i]}">
          <input type="radio" name="${item.id}" value="${p}" ${raw(value === p ? "checked" : "")}>
          <span class="sr">${scale.labels[i]}</span>
        </label>`))}
      <span class="likert-end">${scale.labels[n - 1]}</span>
    </div>
  </fieldset>`;
}

function choiceHTML(item, value, index) {
  return html`<fieldset class="item" data-item="${item.id}" style="--i:${index}">
    <legend class="item-prompt"><span class="item-n num">${index + 1}</span>${item.prompt}</legend>
    <div class="choices">
      ${join(item.options.map((o) => html`
        <label class="choice${value === o.value ? " on" : ""}">
          <input type="radio" name="${item.id}" value="${o.value}" ${raw(value === o.value ? "checked" : "")}>
          <span>${o.label}</span>
        </label>`))}
    </div>
  </fieldset>`;
}

function multiHTML(item, value, index) {
  const picked = new Set(Array.isArray(value) ? value : []);
  const limit = item.max ? `Choose up to ${item.max}.` : "Choose any that apply.";
  return html`<fieldset class="item" data-item="${item.id}" style="--i:${index}">
    <legend class="item-prompt"><span class="item-n num">${index + 1}</span>${item.prompt}<span class="item-hint">${limit}</span></legend>
    <div class="choices">
      ${join(item.options.map((o) => html`
        <label class="choice${picked.has(o.value) ? " on" : ""}">
          <input type="checkbox" name="${item.id}" value="${o.value}" ${raw(picked.has(o.value) ? "checked" : "")}>
          <span>${o.label}</span>
        </label>`))}
    </div>
  </fieldset>`;
}

function itemHTML(item, value, scale, index) {
  if (item.kind === "likert") return likertHTML(item, value, scale, index);
  if (item.kind === "choice") return choiceHTML(item, value, index);
  return multiHTML(item, value, index);
}

/* ══ profiler fields ══════════════════════════════════════════════ */

function fieldHTML(field, value, error) {
  const id = `f-${field.id}`;
  const v = value ?? field.value ?? "";
  let control;
  if (field.kind === "select") {
    control = html`<select id="${id}" name="${field.id}">
      ${join(field.options.map((o) => html`<option value="${o.value}" ${raw(String(o.value) === String(v) ? "selected" : "")}>${o.label}</option>`))}
    </select>`;
  } else if (field.kind === "multi") {
    control = html`<div class="choices">${join(field.options.map((o) => html`
      <label class="choice${(value ?? []).includes(o.value) ? " on" : ""}">
        <input type="checkbox" name="${field.id}" value="${o.value}" ${raw((value ?? []).includes(o.value) ? "checked" : "")}><span>${o.label}</span>
      </label>`))}</div>`;
  } else {
    const type = field.kind === "number" ? "number" : field.kind === "date" ? "date" : "text";
    control = html`<input id="${id}" name="${field.id}" type="${type}" value="${v}"
      ${raw(field.min != null ? `min="${field.min}"` : "")} ${raw(field.max != null ? `max="${field.max}"` : "")}
      ${raw(field.placeholder ? `placeholder="${field.placeholder}"` : "")}
      ${raw(field.kind === "number" ? 'inputmode="numeric"' : "")} autocomplete="off">`;
  }
  return html`<div class="field${error ? " bad" : ""}">
    <label class="label" for="${id}">${field.label}${field.optional ? html`<span class="opt"> optional</span>` : ""}</label>
    ${control}
    ${error ? html`<p class="warn" role="alert">${error}</p>` : ""}
  </div>`;
}

/* ══ reading answers back out ═════════════════════════════════════ */

/** Pull the current value of one item/field out of a container element. */
function readControl(root, spec) {
  const nodes = [...root.querySelectorAll(`[name="${CSS.escape(spec.id)}"]`)];
  if (!nodes.length) return undefined;
  const [first] = nodes;
  if (first.type === "checkbox") return nodes.filter((n) => n.checked).map((n) => coerce(n.value));
  if (first.type === "radio") { const on = nodes.find((n) => n.checked); return on ? coerce(on.value) : undefined; }
  if (first.value === "") return spec.optional ? "" : undefined;
  return spec.kind === "number" || spec.kind === "select" ? coerce(first.value) : first.value;
}

const coerce = (v) => (v !== "" && Number.isFinite(Number(v)) ? Number(v) : v);

export { itemHTML, fieldHTML, readControl };
