"use client";

export type TrackingParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export const WHATSAPP_NUMBER = "31625375673";
export const DEFAULT_WHATSAPP_MESSAGE =
  "Bonjour, je souhaite réserver ma place pour le Voyage Holistique.";
export const RETREAT_VALUE = 7960;
export const RETREAT_CURRENCY = "MAD";

const firedOnceKeys = new Set<string>();

function getDeviceType() {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getPagePath() {
  if (typeof window === "undefined") return "";
  return `${window.location.pathname}${window.location.search}`;
}

function getTimeOnPage() {
  if (typeof window === "undefined" || !window.performance) return 0;
  return Math.round(window.performance.now() / 1000);
}

function cleanParams(params: TrackingParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );
}

export function getWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function trackGA4Event(
  eventName: string,
  params: TrackingParams = {}
) {
  if (typeof window === "undefined" || !window.gtag) return;
  const cleanedParams = cleanParams(params);
  logDebug(`GA4: ${eventName}`, cleanedParams);
  window.gtag("event", eventName, cleanedParams);
}

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

function logDebug(eventName: string, params: TrackingParams = {}) {
  if (isDevelopment()) {
    console.log("[tracking]", eventName, params);
  }
}

export function trackMetaEvent(
  eventName: string,
  params: TrackingParams = {}
) {
  if (typeof window === "undefined" || !window.fbq) return;
  const cleanedParams = cleanParams(params);
  logDebug(`Meta track: ${eventName}`, cleanedParams);
  window.fbq("track", eventName, cleanedParams);
}

export function trackMetaCustomEvent(
  eventName: string,
  params: TrackingParams = {}
) {
  if (typeof window === "undefined" || !window.fbq) return;
  const cleanedParams = cleanParams(params);
  logDebug(`Meta custom: ${eventName}`, cleanedParams);
  window.fbq("trackCustom", eventName, cleanedParams);
}

export function pushDataLayerEvent(
  eventName: string,
  params: TrackingParams = {}
) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  const eventData = cleanParams({
    event: eventName,
    page_path: getPagePath(),
    device_type: getDeviceType(),
    time_on_page: getTimeOnPage(),
    ...params
  });
  logDebug(`dataLayer: ${eventName}`, eventData);
  window.dataLayer.push(eventData);
}

export function pushDataLayerOnce(
  eventName: string,
  uniqueKey: string = eventName,
  params: TrackingParams = {}
) {
  if (firedOnceKeys.has(uniqueKey)) return false;
  firedOnceKeys.add(uniqueKey);
  pushDataLayerEvent(eventName, params);
  return true;
}

export function trackEvent(
  eventName: string,
  params: TrackingParams = {}
) {
  pushDataLayerEvent(eventName, params);
  trackGA4Event(eventName, params);
}

export function initTracking() {
  pushDataLayerOnce("page_view");
}

export function markUserEngagedDeep(
  reason: string,
  params: TrackingParams = {}
) {
  const eventName = "user_engaged_deep";
  const eventParams = {
    event_category: "engagement",
    engagement_reason: reason,
    ...params
  };
  
  if (pushDataLayerOnce(eventName, eventName, eventParams)) {
    trackGA4Event(eventName, eventParams);
    trackMetaCustomEvent(eventName, eventParams);
  }
}

export function markHighIntentUser(
  reason: string,
  params: TrackingParams = {}
) {
  const eventName = "high_intent_user";
  const eventParams = {
    event_category: "intent",
    intent_reason: reason,
    ...params
  };
  
  if (pushDataLayerOnce(eventName, eventName, eventParams)) {
    trackGA4Event(eventName, eventParams);
    trackMetaCustomEvent(eventName, eventParams);
  }
}

export function trackCtaClick({
  eventName,
  buttonText,
  sectionName,
  destinationUrl,
  ctaLocation,
  ...params
}: {
  eventName: string;
  buttonText: string;
  sectionName: string;
  destinationUrl?: string;
  ctaLocation?: string;
} & TrackingParams) {
  const eventParams = cleanParams({
    event_category: "cta",
    button_text: buttonText,
    section_name: sectionName,
    destination_url: destinationUrl,
    cta_location: ctaLocation,
    ...params
  });

  pushDataLayerEvent(eventName, eventParams);
  trackGA4Event(eventName, eventParams);
  trackMetaCustomEvent(eventName, eventParams);

  markUserEngagedDeep("cta_click", {
    source_event: eventName,
    section_name: sectionName
  });
}

export function trackBookingModal(
  action: "open" | "close",
  params: TrackingParams = {}
) {
  const eventName = `booking_modal_${action}`;
  const eventParams = cleanParams({
    modal_name: "booking_modal",
    form_name: "voyage_holistique_booking",
    ...params
  });

  pushDataLayerEvent(eventName, eventParams);
  trackGA4Event(eventName, eventParams);

  if (action === "open") {
    trackMetaEvent("ViewContent", {
      content_name: "Voyage Holistique Booking",
      content_category: "booking",
      ...eventParams
    });
    trackMetaCustomEvent(eventName, eventParams);
    markHighIntentUser("booking_modal_open");
  }
}

export function trackFormEvent(
  eventType:
    | "start"
    | "field_interaction"
    | "submit_attempt"
    | "submit_success"
    | "submit_error",
  params: TrackingParams = {}
) {
  const eventName = `form_${eventType}`;
  const eventParams = cleanParams({
    form_name: "voyage_holistique_booking",
    lead_type: "booking_request",
    ...params
  });

  pushDataLayerEvent(eventName, eventParams);
  trackGA4Event(eventName, eventParams);
  trackMetaCustomEvent(eventName, eventParams);

  if (eventType === "submit_success") {
    trackGA4Event("generate_lead", {
      form_name: "voyage_holistique_booking",
      lead_type: "booking_request",
      value: RETREAT_VALUE,
      currency: RETREAT_CURRENCY
    });
    trackMetaEvent("Lead", {
      value: RETREAT_VALUE,
      currency: RETREAT_CURRENCY,
      content_name: "Voyage Holistique Booking"
    });
  }
}

export function trackWhatsAppClick({
  sectionName,
  buttonText,
  messagePrefill = DEFAULT_WHATSAPP_MESSAGE,
  ...params
}: {
  sectionName: string;
  buttonText: string;
  messagePrefill?: string;
} & TrackingParams) {
  const eventParams = cleanParams({
    event_category: "contact",
    section_name: sectionName,
    button_text: buttonText,
    whatsapp_number: WHATSAPP_NUMBER,
    message_prefill: messagePrefill,
    destination_url: getWhatsAppUrl(messagePrefill),
    ...params
  });

  pushDataLayerEvent("whatsapp_click", eventParams);
  trackGA4Event("whatsapp_click", eventParams);
  trackMetaEvent("Contact", {
    content_name: "WhatsApp Contact",
    ...eventParams
  });

  markHighIntentUser("whatsapp_click", { section_name: sectionName });
  markUserEngagedDeep("whatsapp_click", { section_name: sectionName });
}

export function trackOfferReserve(params: TrackingParams = {}) {
  const eventParams = cleanParams({
    value: RETREAT_VALUE,
    currency: RETREAT_CURRENCY,
    section_name: "offer",
    ...params
  });

  const ctaParams = {
    eventName: "offer_reserve_click",
    buttonText: "Réserver",
    sectionName: "offer",
    ...eventParams
  };

  pushDataLayerEvent(ctaParams.eventName, eventParams);
  trackGA4Event(ctaParams.eventName, eventParams);

  trackMetaEvent("InitiateCheckout", {
    value: RETREAT_VALUE,
    currency: RETREAT_CURRENCY,
    content_name: "Voyage Holistique"
  });

  markUserEngagedDeep("cta_click", {
    source_event: ctaParams.eventName,
    section_name: ctaParams.sectionName
  });
}

export function trackProgrammeDayClick({
  dayNumber,
  dayLabel,
  buttonText,
  ...params
}: {
  dayNumber: number;
  dayLabel: string;
  buttonText: string;
} & TrackingParams) {
  const eventParams = cleanParams({
    day_number: dayNumber,
    day_label: dayLabel,
    section_name: "programme",
    button_text: buttonText,
    ...params
  });

  const ga4EventName = "programme_day_click";
  const metaEventName = `programme_day_${dayNumber}_click`;

  pushDataLayerEvent(ga4EventName, eventParams);
  trackGA4Event(ga4EventName, eventParams);
  trackMetaCustomEvent(metaEventName, eventParams);

  markUserEngagedDeep("cta_click", {
    source_event: metaEventName,
    section_name: "programme"
  });
}

export function trackProgrammeNavigation({
  direction,
  fromDay,
  toDay,
  fromDayLabel,
  toDayLabel,
  buttonText,
  ...params
}: {
  direction: "previous" | "next";
  fromDay: number;
  toDay: number;
  fromDayLabel: string;
  toDayLabel: string;
  buttonText: string;
} & TrackingParams) {
  const eventParams = cleanParams({
    direction,
    from_day: fromDay,
    to_day: toDay,
    from_day_label: fromDayLabel,
    to_day_label: toDayLabel,
    section_name: "programme",
    button_text: buttonText,
    ...params
  });

  const ga4EventName = direction === "next" ? "programme_next_day_click" : "programme_previous_day_click";

  pushDataLayerEvent(ga4EventName, eventParams);
  trackGA4Event(ga4EventName, eventParams);
  trackMetaCustomEvent(ga4EventName, eventParams);

  markUserEngagedDeep("cta_click", {
    source_event: ga4EventName,
    section_name: "programme"
  });
}

export function trackFaqInteraction({
  faqQuestion,
  faqAction,
  faqIndex,
}: {
  faqQuestion: string;
  faqAction: "open" | "close";
  faqIndex: number;
}) {
  const eventParams = cleanParams({
    faq_question: faqQuestion,
    faq_action: faqAction,
    faq_index: faqIndex,
    section_name: "faq"
  });

  const ga4EventName = "faq_interaction";
  const metaEventName = `faq_${faqIndex}_${faqAction}`;

  pushDataLayerEvent(ga4EventName, eventParams);
  trackGA4Event(ga4EventName, eventParams);
  trackMetaCustomEvent(metaEventName, eventParams);
}

export function trackNavClick({
  buttonText,
  sectionName,
  destinationUrl,
}: {
  buttonText: string;
  sectionName: string;
  destinationUrl: string;
}) {
  const eventName = sectionName === "mobile_menu" ? "mobile_nav_click" : "header_nav_click";
  const eventParams = cleanParams({
    event_category: "navigation",
    button_text: buttonText,
    section_name: sectionName,
    destination_url: destinationUrl,
  });

  pushDataLayerEvent(eventName, eventParams);
  trackGA4Event(eventName, eventParams);
  trackMetaCustomEvent(eventName, eventParams);
}

export function trackTestimonialInteraction({
  buttonText,
  action,
  ...params
}: {
  buttonText: string;
  action: "previous" | "next";
} & TrackingParams) {
  const eventName = "testimonial_interaction";
  const eventParams = cleanParams({
    event_category: "testimonial",
    button_text: buttonText,
    action,
    section_name: "testimonial",
    ...params
  });

  pushDataLayerEvent(eventName, eventParams);
  trackGA4Event(eventName, eventParams);
  trackMetaCustomEvent(eventName, eventParams);
}

export function trackFooterLegalClick({
  buttonText,
  ...params
}: {
  buttonText: string;
} & TrackingParams) {
  const eventName = "footer_legal_click";
  const eventParams = cleanParams({
    event_category: "footer",
    button_text: buttonText,
    section_name: "footer",
    ...params
  });

  pushDataLayerEvent(eventName, eventParams);
  trackGA4Event(eventName, eventParams);
  trackMetaCustomEvent(eventName, eventParams);
}

export function trackFooterNavClick({
  buttonText,
  destinationUrl,
}: {
  buttonText: string;
  destinationUrl: string;
}) {
  const eventName = "footer_nav_click";
  const eventParams = cleanParams({
    event_category: "footer",
    button_text: buttonText,
    section_name: "footer",
    destination_url: destinationUrl
  });

  pushDataLayerEvent(eventName, eventParams);
  trackGA4Event(eventName, eventParams);
  trackMetaCustomEvent(eventName, eventParams);
}

export function trackScrollDepth(percent: number) {
  const eventName = `scroll_${percent}`;
  const uniqueKey = `scroll_${percent}`;
  
  if (pushDataLayerOnce(eventName, uniqueKey, { scroll_percent: percent })) {
    trackGA4Event(eventName, { scroll_percent: percent });
    trackMetaCustomEvent(eventName, { scroll_percent: percent });
  }
}

export function trackSectionView(
  sectionName: string,
  visibilityPercent: number
) {
  const params = {
    section_name: sectionName,
    visibility_percent: visibilityPercent,
    time_on_page: getTimeOnPage()
  };

  const uniqueKey = `section_view_${sectionName}`;
  const metaEventName = `section_view_${sectionName}`;

  if (pushDataLayerOnce(metaEventName, uniqueKey, params)) {
    trackGA4Event("section_view", params);
    trackMetaCustomEvent(metaEventName, params);

    if (sectionName === "offer") {
      trackGA4Event("section_view_offer", params);
    }
  }
}

export function trackTimeOnPage(seconds: number) {
  const eventName = `time_on_page_${seconds}s`;
  const uniqueKey = `time_on_page_${seconds}s`;
  
  if (pushDataLayerOnce(eventName, uniqueKey, { time_on_page: seconds })) {
    trackGA4Event(eventName, { time_on_page: seconds });
    trackMetaCustomEvent(eventName, { time_on_page: seconds });
  }
}
