const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface HostedZone {
  id: number;
  name: string;
  zone_type: string;
  description?: string;
  record_count: number;
}

export interface DNSRecord {
  id: number;
  name: string;
  record_type: string;
  ttl: number;
  value: string;
  hosted_zone_id: number;
}

export async function getHostedZones(
  search = ""
): Promise<HostedZone[]> {
  const url = new URL(`${API_URL}/hosted-zones/`);

  if (search) {
    url.searchParams.set("search", search);
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch hosted zones");
  }

  return response.json();
}

export async function createHostedZone(data: {
  name: string;
  zone_type: string;
  description?: string;
}) {
  const response = await fetch(`${API_URL}/hosted-zones/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Failed to create hosted zone");
  }

  return result;
}

export async function updateHostedZone(
  id: number,
  data: {
    name?: string;
    zone_type?: string;
    description?: string;
  }
) {
  const response = await fetch(`${API_URL}/hosted-zones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Failed to update hosted zone");
  }

  return result;
}

export async function deleteHostedZone(id: number) {
  const response = await fetch(`${API_URL}/hosted-zones/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Failed to delete hosted zone");
  }

  return result;
}

export async function getRecords(
  zoneId: number,
  search = "",
  recordType = ""
): Promise<DNSRecord[]> {
  const url = new URL(
    `${API_URL}/hosted-zones/${zoneId}/records/`
  );

  if (search) {
    url.searchParams.set("search", search);
  }

  if (recordType) {
    url.searchParams.set("record_type", recordType);
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch records");
  }

  return response.json();
}

export async function createRecord(
  zoneId: number,
  data: {
    name: string;
    record_type: string;
    ttl: number;
    value: string;
  }
) {
  const response = await fetch(
    `${API_URL}/hosted-zones/${zoneId}/records/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Failed to create record");
  }

  return result;
}

export async function updateRecord(
  zoneId: number,
  recordId: number,
  data: {
    name?: string;
    record_type?: string;
    ttl?: number;
    value?: string;
  }
) {
  const response = await fetch(
    `${API_URL}/hosted-zones/${zoneId}/records/${recordId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Failed to update record");
  }

  return result;
}

export async function deleteRecord(
  zoneId: number,
  recordId: number
) {
  const response = await fetch(
    `${API_URL}/hosted-zones/${zoneId}/records/${recordId}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Failed to delete record");
  }

  return result;
}